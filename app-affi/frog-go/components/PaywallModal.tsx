"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Check, CreditCard, Loader2, Shield, Infinity as InfinityIcon } from "lucide-react";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const features = [
        "Analyses illimitées à vie",
        "Prédiction IA avancée",
        "Tous les futurs updates gratuits",
        "Support prioritaire",
    ];

    const handlePurchase = async () => {
        if (!email) {
            alert("Email requis pour la facture");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone }),
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Erreur lors du paiement. Réessaye.");
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-frog-green/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.15)]"
                    >
                        {/* Header */}
                        <div className="relative p-6 bg-gradient-to-br from-frog-green/20 via-frog-cyan/10 to-transparent">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <motion.div
                                    className="inline-block mb-4"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <img
                                        src="/frog-transparent-final.png"
                                        alt="Frog AI"
                                        className="w-20 h-20 object-contain drop-shadow-[0_0_30px_rgba(0,255,157,0.5)]"
                                    />
                                </motion.div>
                                <h2 className="text-2xl font-black text-white mb-1">
                                    Accès <span className="text-frog-green">Lifetime</span>
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Paiement unique, accès à vie
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="px-6 py-8 text-center border-b border-white/10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-2xl text-gray-500 line-through">$97</span>
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                                    -52%
                                </span>
                            </div>
                            <div className="text-6xl font-black text-white mb-2">
                                $47
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <InfinityIcon className="w-4 h-4 text-frog-green" />
                                <span>Paiement unique</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="p-6 space-y-3">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 bg-frog-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-frog-green" />
                                    </div>
                                    <span className="text-gray-300">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Email + Phone + CTA */}
                        <div className="p-6 space-y-3 border-t border-white/10">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ton email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                required
                            />

                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ton numéro de téléphone"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                required
                            />

                            <button
                                onClick={handlePurchase}
                                disabled={isLoading || !email || !phone}
                                className="w-full py-4 bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Obtenir l'accès - $47
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Shield className="w-4 h-4" />
                                <span>Paiement sécurisé par Stripe</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
