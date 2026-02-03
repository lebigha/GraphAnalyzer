import { NextRequest, NextResponse } from "next/server";

// Store leads in memory (in production, use a database like Supabase)
// For now, we'll log them and they'll be stored in localStorage on the client

export async function POST(request: NextRequest) {
    try {
        const { email, phone } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Log the lead (in production, save to database)
        console.log("[WAITLIST] New lead:", { email, phone, timestamp: new Date().toISOString() });

        // TODO: Add Supabase integration here
        // const { data, error } = await supabase
        //     .from('waitlist')
        //     .insert([{ email, phone }]);

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
