"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpsellModal({ isOpen, onClose }: UpsellModalProps) {
    const { t } = useTranslation();

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
                        <div className="glass-card p-6 md:p-8 border-frog-green/20 relative overflow-hidden">
                            {/* Glow */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-frog-green/20 blur-[100px] pointer-events-none" />

                            {/* Close */}
                            <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="mb-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-frog-green/20 flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-frog-green" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{t.upsell.waitTitle}</h3>
                                    <p className="text-gray-400 text-sm">{t.upsell.waitDesc}</p>
                                </div>

                                {/* Options */}
                                <div className="space-y-3 mb-6">
                                    {/* VIP Group */}
                                    <a
                                        href="https://t.me/frogai_vip"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-frog-green/10 to-frog-cyan/10 border border-frog-green/20 hover:border-frog-green/40 transition-all group"
                                    >
                                        <div>
                                            <p className="font-bold text-white">{t.upsell.joinVip}</p>
                                            <p className="text-xs text-gray-400">{t.upsell.dailySignals}</p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-frog-green group-hover:translate-x-1 transition-transform" />
                                    </a>

                                    {/* Recommended Broker */}
                                    <a
                                        href="https://partner.bybit.com/frogai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-frog-green/30 transition-all group"
                                    >
                                        <div>
                                            <p className="font-bold text-white">{t.upsell.recommendedBroker}</p>
                                            <p className="text-xs text-gray-400">{t.upsell.welcomeBonus}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-frog-green group-hover:translate-x-1 transition-all" />
                                    </a>
                                </div>

                                {/* Skip */}
                                <button
                                    onClick={onClose}
                                    className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
                                >
                                    {t.upsell.noThanks}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
