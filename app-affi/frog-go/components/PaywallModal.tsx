"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Shield, Star, CreditCard } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handlePayment = async () => {
        if (!email) {
            setError(t.paywall.emailRequired);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                setError(t.paywall.errorPayment);
            }
        } catch {
            setError(t.paywall.errorPayment);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        t.paywall.feature1,
        t.paywall.feature2,
        t.paywall.feature3,
        t.paywall.feature4,
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
                    >
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="relative p-6 pb-8 bg-gradient-to-b from-frog-green/10 to-transparent">
                                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-frog-green/10 border border-frog-green/20 mb-4">
                                        <Zap className="w-3 h-3 text-frog-green" />
                                        <span className="text-xs font-mono text-frog-green uppercase">{t.paywall.lifetimeAccess}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white">
                                        {t.paywall.accessTitle} <span className="text-frog-green">{t.paywall.lifetimeAccess}</span>
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">{t.paywall.subtitle}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Features */}
                                <div className="space-y-3">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Check className="w-4 h-4 text-frog-green shrink-0" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Inputs */}
                                <div className="space-y-3 pt-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.paywall.emailPlaceholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-frog-green/50 transition-colors"
                                    />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t.paywall.phonePlaceholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-frog-green/50 transition-colors"
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                {/* CTA */}
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-frog-green to-frog-cyan text-black font-black text-lg hover:shadow-[0_0_40px_rgba(0,255,157,0.3)] transition-all disabled:opacity-50"
                                >
                                    {loading ? "..." : t.paywall.cta}
                                </button>

                                {/* Trust badges */}
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {t.paywall.oneTimePayment}</span>
                                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {t.paywall.securedBy}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
