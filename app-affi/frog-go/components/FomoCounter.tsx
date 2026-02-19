"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Users, Flame } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const TOTAL_SPOTS = 500;

interface FomoCounterProps {
    onWaitlistClick?: () => void;
}

export default function FomoCounter({ onWaitlistClick }: FomoCounterProps) {
    const [spotsLeft, setSpotsLeft] = useState(47);
    const [registered, setRegistered] = useState(TOTAL_SPOTS - 47);
    const { t } = useTranslation();

    useEffect(() => {
        const savedData = localStorage.getItem("fomo_state");
        if (savedData) {
            const data = JSON.parse(savedData);
            setSpotsLeft(data.spotsLeft);
            setRegistered(data.registered);
        } else {
            const initialSpots = Math.floor(Math.random() * 30) + 20;
            setSpotsLeft(initialSpots);
            setRegistered(TOTAL_SPOTS - initialSpots);
            localStorage.setItem("fomo_state", JSON.stringify({ spotsLeft: initialSpots, registered: TOTAL_SPOTS - initialSpots }));
        }

        const interval = setInterval(() => {
            setSpotsLeft(prev => {
                const newSpots = Math.max(0, prev - 1);
                const newRegistered = TOTAL_SPOTS - newSpots;
                setRegistered(newRegistered);
                localStorage.setItem("fomo_state", JSON.stringify({ spotsLeft: newSpots, registered: newRegistered }));
                return newSpots;
            });
        }, Math.random() * 60000 + 30000);

        return () => clearInterval(interval);
    }, []);

    const percentage = (registered / TOTAL_SPOTS) * 100;

    if (spotsLeft <= 0) {
        return (
            <div className="glass-card inline-flex flex-col items-center gap-3 px-8 py-5 border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    {t.fomo.complete}
                </div>
                <p className="text-gray-400 text-sm">{t.fomo.completeDesc}</p>
                <button
                    onClick={onWaitlistClick}
                    className="text-sm text-frog-green hover:text-white transition-colors font-medium"
                >
                    {t.fomo.joinWaitlist}
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card inline-flex flex-col items-center gap-3 px-8 py-5 border-frog-green/20 bg-frog-green/5 hover:border-frog-green/40 transition-all">
            <div className="flex items-center gap-2 text-frog-green font-bold text-sm uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                {t.fomo.limitedAccess}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-bold text-lg">{registered}</span>
                    <span className="text-gray-500 text-sm">{t.fomo.registered}</span>
                </div>
                <div className="text-white/20">|</div>
                <div>
                    <span className="text-frog-green font-bold text-lg">{spotsLeft}</span>
                    <span className="text-gray-500 text-sm ml-1">{t.fomo.spotsLeft} {TOTAL_SPOTS}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-frog-green to-frog-cyan rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-gray-500">{Math.round(percentage)}% {t.fomo.filledOffer}</p>
        </div>
    );
}
