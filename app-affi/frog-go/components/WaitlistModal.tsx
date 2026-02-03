"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Send, CheckCircle, Loader2 } from "lucide-react";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email requis");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'inscription");
            }

            setIsSuccess(true);
            // Save locally too
            localStorage.setItem("frog_waitlist_email", email);
            if (phone) localStorage.setItem("frog_waitlist_phone", phone);
        } catch (err) {
            // Still save locally even if API fails
            localStorage.setItem("frog_waitlist_email", email);
            if (phone) localStorage.setItem("frog_waitlist_phone", phone);
            setIsSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-6 bg-gradient-to-br from-frog-green/20 to-frog-cyan/20 border-b border-white/10">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <div className="text-5xl mb-4">🐸</div>
                                <h2 className="text-2xl font-black text-white mb-2">
                                    Rejoins la Liste VIP
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Sois le premier informé quand des places se libèrent
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <CheckCircle className="w-16 h-16 text-frog-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Tu es inscrit! 🎉
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        On te contacte dès qu'une place se libère.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        Fermer
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ton@email.com"
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Téléphone (optionnel)
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 234 567 890"
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-sm text-center">{error}</p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Send className="w-5 h-5" />
                                                Rejoindre la liste
                                            </span>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center">
                                        🔒 Tes données restent confidentielles. Pas de spam.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
