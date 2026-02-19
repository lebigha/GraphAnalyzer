"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import UpsellModal from "@/components/UpsellModal";
import { useTranslation } from "@/lib/i18n";

export default function SuccessPage() {
    return (
        <Suspense fallback={<SuccessLoading />}>
            <SuccessContent />
        </Suspense>
    );
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState<string | null>(null);
    const [showUpsell, setShowUpsell] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Mark user as premium
        localStorage.setItem("frog_premium", "true");
        localStorage.setItem("frog_premium_date", new Date().toISOString());

        // Get email from URL or storage
        const urlEmail = searchParams.get("email");
        if (urlEmail) {
            setEmail(urlEmail);
            localStorage.setItem("frog_premium_email", urlEmail);
        }

        // Show upsell modal after a short delay
        const timer = setTimeout(() => {
            setShowUpsell(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <UpsellModal isOpen={showUpsell} onClose={() => setShowUpsell(false)} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full text-center"
            >
                {/* Success animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 bg-frog-green/20 blur-3xl rounded-full" />
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-frog-green to-frog-cyan rounded-full flex items-center justify-center">
                        <CheckCircle className="w-16 h-16 text-black" />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black text-white mb-4"
                >
                    {t.success.welcomeTitle} <span className="text-frog-green">{t.success.welcomeHighlight}</span> 🐸
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-lg mb-8"
                >
                    {t.success.lifetimeActive}
                </motion.p>

                {/* Benefits */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-frog-green" />
                        <span className="font-bold text-white">{t.success.unlocked}</span>
                    </div>
                    <ul className="space-y-3 text-left">
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-frog-green flex-shrink-0" />
                            <span>{t.success.feature1}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-frog-green flex-shrink-0" />
                            <span>{t.success.feature2}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-frog-green flex-shrink-0" />
                            <span>{t.success.feature3}</span>
                        </li>
                    </ul>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/analyze">
                        <button className="group w-full py-4 bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] transition-all">
                            <span className="flex items-center justify-center gap-2">
                                {t.success.startAnalyzing}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </Link>
                </motion.div>

                {email && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6 text-sm text-gray-500"
                    >
                        {t.success.confirmationSent} {email}
                    </motion.p>
                )}
            </motion.div>
        </main>
    );
}

// Loading fallback for Suspense
function SuccessLoading() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-frog-green animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading...</p>
            </div>
        </main>
    );
}




