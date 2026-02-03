"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Zap } from "lucide-react";

interface FomoCounterProps {
    onWaitlistClick: () => void;
}

export default function FomoCounter({ onWaitlistClick }: FomoCounterProps) {
    const [spotsLeft, setSpotsLeft] = useState(47);
    const [isComplete, setIsComplete] = useState(false);
    const totalSpots = 500;

    // Simuler une diminution des places
    useEffect(() => {
        const stored = localStorage.getItem('frog_spots_left');
        if (stored) {
            const spots = parseInt(stored);
            setSpotsLeft(spots);
            setIsComplete(spots <= 0);
        }
    }, []);

    const percentFilled = Math.round(((totalSpots - spotsLeft) / totalSpots) * 100);

    if (isComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="text-xl font-bold text-white mb-2">COMPLET</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Toutes les places ont été prises. Rejoins la liste d'attente.
                    </p>
                    <button
                        onClick={onWaitlistClick}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        📧 Rejoindre la liste d'attente
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="bg-gradient-to-br from-frog-green/10 to-frog-cyan/10 border border-frog-green/30 rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-frog-green" />
                        <span className="text-sm font-bold text-frog-green uppercase tracking-wide">
                            Accès Limité
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{totalSpots - spotsLeft} inscrits</span>
                    </div>
                </div>

                {/* Counter */}
                <div className="text-center mb-4">
                    <div className="text-5xl font-black text-white mb-1">
                        {spotsLeft}
                    </div>
                    <div className="text-sm text-gray-400">
                        places restantes sur {totalSpots}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-frog-green to-frog-cyan rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentFilled}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>

                {/* Urgency text */}
                <div className="flex items-center justify-center gap-2 text-sm text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                        {percentFilled}% rempli - Offre bientôt terminée
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
