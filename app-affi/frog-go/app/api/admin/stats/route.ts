import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin stats API — protected by a secret key
export async function GET(request: NextRequest) {
    // Simple admin protection via secret key
    const adminKey = request.headers.get("x-admin-key");
    const expectedKey = process.env.ADMIN_SECRET_KEY || "hoho";

    if (adminKey !== expectedKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    try {
        // Get total users from auth
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
            perPage: 1000,
        });

        // Get analyses stats
        const { count: totalAnalyses } = await supabase
            .from("analyses")
            .select("*", { count: "exact", head: true });

        // Get analyses from last 24h
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: analysesToday } = await supabase
            .from("analyses")
            .select("*", { count: "exact", head: true })
            .gte("created_at", oneDayAgo);

        // Get analyses from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: analysesWeek } = await supabase
            .from("analyses")
            .select("*", { count: "exact", head: true })
            .gte("created_at", sevenDaysAgo);

        // Get unique users who did analyses
        const { data: uniqueAnalysts } = await supabase
            .from("analyses")
            .select("user_id")
            .limit(1000);

        const uniqueUserIds = new Set(uniqueAnalysts?.map((a: { user_id: string }) => a.user_id) || []);

        // Get recent analyses with signal distribution
        const { data: recentAnalyses } = await supabase
            .from("analyses")
            .select("signal, trend, trade_grade, confidence, created_at")
            .order("created_at", { ascending: false })
            .limit(100);

        // Signal distribution
        const signalCounts = { BULLISH: 0, BEARISH: 0, NEUTRAL: 0 };
        recentAnalyses?.forEach((a: { signal: string }) => {
            const s = a.signal as keyof typeof signalCounts;
            if (signalCounts[s] !== undefined) signalCounts[s]++;
        });

        // Users list (recent 20)
        const users = usersData?.users || [];
        const recentUsers = users
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 20)
            .map(u => ({
                email: u.email || "N/A",
                createdAt: u.created_at,
                lastSignIn: u.last_sign_in_at,
            }));

        // Users registered today
        const usersToday = users.filter(u => new Date(u.created_at) >= new Date(oneDayAgo)).length;
        const usersThisWeek = users.filter(u => new Date(u.created_at) >= new Date(sevenDaysAgo)).length;

        return NextResponse.json({
            users: {
                total: users.length,
                today: usersToday,
                thisWeek: usersThisWeek,
                activeAnalysts: uniqueUserIds.size,
                recent: recentUsers,
            },
            analyses: {
                total: totalAnalyses || 0,
                today: analysesToday || 0,
                thisWeek: analysesWeek || 0,
                signals: signalCounts,
            },
        });
    } catch (error) {
        console.error("[ADMIN] Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
