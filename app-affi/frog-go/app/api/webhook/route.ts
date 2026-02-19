import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Lazy clients to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-12-15.clover",
    });
}

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase not configured");
    return createClient(url, key);
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature || !webhookSecret) {
            console.error("[WEBHOOK] Missing signature or webhook secret");
            return new NextResponse("Webhook configuration error", { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`[WEBHOOK] Signature verification failed: ${err.message}`);
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
        }

        // Handle the event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            // Get user email
            const email = session.customer_details?.email || session.metadata?.email;

            console.log(`[WEBHOOK] 💰 Payment received for ${email}`);

            if (email) {
                // Update or Create user in 'profiles' table
                const { error } = await getSupabaseAdmin()
                    .from('profiles')
                    .upsert({
                        email,
                        is_premium: true,
                        premium_since: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'email'
                    });

                if (error) {
                    console.error('[WEBHOOK] ❌ Supabase update failed:', error);
                    return new NextResponse("Database Error", { status: 500 });
                }

                console.log(`[WEBHOOK] ✅ User ${email} marked as PREMIUM in DB`);
            } else {
                console.warn("[WEBHOOK] ⚠️ Payment received but no email found in session");
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[WEBHOOK] Handler error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

