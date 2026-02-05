import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { email, phone } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Save to Supabase waitlist table
        const { error } = await supabase
            .from('waitlist')
            .upsert([{
                email,
                phone: phone || null,
                created_at: new Date().toISOString()
            }], {
                onConflict: 'email'
            });

        if (error) {
            console.error("[WAITLIST] Supabase error:", error);
            // Still return success to not break UX
        }

        console.log("[WAITLIST] New lead saved:", { email, phone });

        return NextResponse.json({
            success: true,
            message: "Successfully joined waitlist"
        });

    } catch (error) {
        console.error("[WAITLIST] Error:", error);
        return NextResponse.json(
            { error: "Failed to join waitlist" },
            { status: 500 }
        );
    }
}

