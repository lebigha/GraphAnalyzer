"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError(t.waitlist.emailRequired);
            return;
        }

        setLoading(true);
        setError("");

        try {
            await new Promise(r => setTimeout(r, 1000));
            setSubmitted(true);
        } catch {
            setError(t.waitlist.errorSignup);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
                    >
                        <div className="glass-card p-6 md:p-8 border-frog-green/20 relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-frog-green/20 blur-[100px] pointer-events-none" />

                            {/* Close */}
                            <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            {submitted ? (
                                <div className="text-center py-8 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-frog-green/20 flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-frog-green" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{t.waitlist.successTitle}</h3>
                                    <p className="text-gray-400">{t.waitlist.successDesc}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                                    >
                                        {t.waitlist.close}
                                    </button>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-frog-green" />
                                        <h3 className="text-xl font-bold text-white">{t.waitlist.title}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6">{t.waitlist.subtitle}</p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">{t.waitlist.emailLabel}</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={t.waitlist.emailPlaceholder}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-frog-green/50 transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">{t.waitlist.phoneLabel}</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={t.waitlist.phonePlaceholder}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-frog-green/50 transition-colors"
                                            />
                                        </div>

                                        {error && <p className="text-red-400 text-sm">{error}</p>}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full btn-neon py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "..." : t.waitlist.submit}
                                        </button>

                                        <p className="text-xs text-gray-600 text-center">{t.waitlist.privacyNote}</p>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
