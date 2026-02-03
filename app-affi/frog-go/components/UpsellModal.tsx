"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpsellModal({ isOpen, onClose }: UpsellModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-lg bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-frog-green/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.15)] relative"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Send className="w-10 h-10 text-blue-400 ml-1" />
                            </motion.div>

                            <h2 className="text-3xl font-black text-white mb-2">
                                Attends ! Une dernière chose...
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Maximise tes profits en rejoignant notre communauté privée.
                            </p>

                            <div className="grid gap-4">
                                {/* Telegram Upsell */}
                                <a
                                    href="https://t.me/ton_lien_telegram" // À REMPLACER
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Send className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                Rejoindre le Groupe VIP
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Signaux quotidiens & entraide
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>

                                {/* Broker Upsell */}
                                <a
                                    href="https://broker.com/ref" // À REMPLACER
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative p-4 bg-frog-green/10 border border-frog-green/20 rounded-xl hover:bg-frog-green/20 transition-all text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-frog-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-6 h-6 text-frog-green" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white group-hover:text-frog-green transition-colors">
                                                Broker Recommandé
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Bonus de bienvenue jusqu'à $500
                                            </p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-frog-green transition-colors" />
                                    </div>
                                </a>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                Non merci, je veux juste accéder à l'app
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
