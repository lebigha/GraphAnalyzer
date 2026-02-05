import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe - will use env variable in production
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Stripe must be configured in production
        if (!stripe) {
            console.error("[CHECKOUT] Stripe not configured");
            return NextResponse.json(
                { error: "Payment service unavailable. Please try again later." },
                { status: 503 }
            );
        }

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Frog AI Lifetime Access",
                            description: "Accès illimité à vie à Frog AI - Analyses de trading IA",
                            images: ["https://frog-go.vercel.app/frog-transparent-final.png"],
                        },
                        unit_amount: 4700, // $47.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/analyze`,
            metadata: {
                email: email,
            },
        });

        console.log("[CHECKOUT] Session created:", session.id);

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("[CHECKOUT] Error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
