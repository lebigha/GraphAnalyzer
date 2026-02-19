"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BarChart3, TrendingUp, TrendingDown, Minus, Shield, RefreshCw, ArrowLeft, Activity, Clock, Crown } from "lucide-react";
import Link from "next/link";

interface AdminStats {
    users: {
        total: number;
        today: number;
        thisWeek: number;
        activeAnalysts: number;
        recent: { email: string; createdAt: string; lastSignIn: string | null }[];
    };
    analyses: {
        total: number;
        today: number;
        thisWeek: number;
        signals: { BULLISH: number; BEARISH: number; NEUTRAL: number };
    };
}

const ADMIN_KEY = "hoho";

export default function AdminPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authorized, setAuthorized] = useState(false);
    const [inputKey, setInputKey] = useState("");

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/stats", {
                headers: { "x-admin-key": ADMIN_KEY },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setStats(data);
        } catch {
            setError("Failed to load stats");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey === ADMIN_KEY) {
            setAuthorized(true);
            fetchStats();
        } else {
            setError("Invalid admin key");
        }
    };

    useEffect(() => {
        // Auto-login if key is in localStorage
        const stored = localStorage.getItem("frog_admin_key");
        if (stored === ADMIN_KEY) {
            setAuthorized(true);
            fetchStats();
        } else {
            setLoading(false);
        }
    }, []);

    // Login screen
    if (!authorized) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-sm w-full"
                >
                    <div className="text-center mb-8">
                        <Shield className="w-12 h-12 text-frog-green mx-auto mb-4" />
                        <h1 className="text-2xl font-black text-white">Admin Access</h1>
                        <p className="text-gray-500 text-sm mt-1">Enter admin key to continue</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Admin key..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-frog-green/50 mb-3"
                        />
                        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
                <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <img src="/frog-transparent-final.png" alt="Frog" className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
                            <span className="font-black text-lg">FROG<span className="text-frog-green">AI</span></span>
                            <span className="text-xs bg-frog-green/10 text-frog-green px-2 py-0.5 rounded-full font-mono">ADMIN</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                {loading && !stats ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-frog-green animate-spin" />
                    </div>
                ) : error && !stats ? (
                    <div className="text-center py-20">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : stats ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={<Users className="w-5 h-5" />}
                                label="Total Users"
                                value={stats.users.total}
                                sub={`+${stats.users.today} today`}
                                color="green"
                            />
                            <StatCard
                                icon={<BarChart3 className="w-5 h-5" />}
                                label="Total Analyses"
                                value={stats.analyses.total}
                                sub={`+${stats.analyses.today} today`}
                                color="cyan"
                            />
                            <StatCard
                                icon={<Activity className="w-5 h-5" />}
                                label="Active Users"
                                value={stats.users.activeAnalysts}
                                sub="who ran analyses"
                                color="purple"
                            />
                            <StatCard
                                icon={<Clock className="w-5 h-5" />}
                                label="This Week"
                                value={stats.analyses.thisWeek}
                                sub={`${stats.users.thisWeek} new users`}
                                color="orange"
                            />
                        </div>

                        {/* Signal Distribution + Recent Users */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Signal Distribution */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-frog-green" />
                                    Signal Distribution
                                </h3>
                                <div className="space-y-4">
                                    <SignalBar label="BULLISH" count={stats.analyses.signals.BULLISH} total={stats.analyses.total} color="bg-green-500" icon={<TrendingUp className="w-4 h-4" />} />
                                    <SignalBar label="BEARISH" count={stats.analyses.signals.BEARISH} total={stats.analyses.total} color="bg-red-500" icon={<TrendingDown className="w-4 h-4" />} />
                                    <SignalBar label="NEUTRAL" count={stats.analyses.signals.NEUTRAL} total={stats.analyses.total} color="bg-gray-400" icon={<Minus className="w-4 h-4" />} />
                                </div>
                            </div>

                            {/* Recent Users */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-frog-green" />
                                    Recent Users
                                </h3>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {stats.users.recent.map((user, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 text-sm">
                                            <span className="text-gray-300 truncate max-w-[200px]">{user.email}</span>
                                            <span className="text-gray-500 text-xs whitespace-nowrap ml-2">
                                                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                    ))}
                                    {stats.users.recent.length === 0 && (
                                        <p className="text-gray-500 text-sm text-center py-4">No users yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </div>
        </main>
    );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function StatCard({ icon, label, value, sub, color }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    sub: string;
    color: string;
}) {
    const colors: Record<string, string> = {
        green: "from-frog-green/20 to-transparent border-frog-green/20 text-frog-green",
        cyan: "from-frog-cyan/20 to-transparent border-frog-cyan/20 text-frog-cyan",
        purple: "from-purple-500/20 to-transparent border-purple-500/20 text-purple-400",
        orange: "from-orange-500/20 to-transparent border-orange-500/20 text-orange-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-b ${colors[color]} border rounded-2xl p-5`}
        >
            <div className="flex items-center gap-2 mb-3 opacity-70">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-black text-white">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
        </motion.div>
    );
}

function SignalBar({ label, count, total, color, icon }: {
    label: string;
    count: number;
    total: number;
    color: string;
    icon: React.ReactNode;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    {icon}
                    {label}
                </div>
                <span className="text-sm font-mono text-gray-400">{count} ({pct}%)</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}
