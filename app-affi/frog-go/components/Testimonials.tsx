"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Alex R.",
        role: "Forex Trader",
        text: "J'ai attrapé le mouvement de 140 pips sur GBP/JPY grâce aux Entry Signals. Le Risk/Reward calculator change la donne.",
        verified: true,
    },
    {
        name: "Sarah K.",
        role: "Crypto Analyst",
        text: "Enfin une IA qui comprend la Market Structure. Les Support Zones sont effrayantes de précision.",
        verified: true,
    },
    {
        name: "David Chen",
        role: "Day Trader",
        text: "J'étais sceptique, mais le 'Invalidation Level' m'a sauvé d'un mauvais Short Setup. Rentabilisé en un seul trade.",
        verified: true,
    },
    {
        name: "Marcus J.",
        role: "Swing Trader",
        text: "Le projection model est dingue. Il a prédit le Pullback au dollar près.",
        verified: true,
    },
    {
        name: "Elena V.",
        role: "Full-time Trader",
        text: "Simple, propre et rapide. Pas de superflu, juste les niveaux dont j'ai besoin pour placer mes Limit Orders.",
        verified: true,
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 relative overflow-hidden border-y border-white/5 bg-[#080c14]">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                    Ils ont Arrêté de <span className="text-red-400">Perdre</span>.
                    <br className="hidden md:block" />
                    Ils ont Commencé à <span className="text-frog-green">Trader</span>.
                </h2>
                <p className="text-gray-400">+10 000 traders utilisent Frog AI pour valider leurs setups.</p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-x-hidden mask-linear-fade">
                <div className="animate-marquee flex gap-6 whitespace-nowrap py-4">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="bg-white/5 border border-white/10 p-6 rounded-xl w-[350px] shrink-0 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-frog-green text-frog-green" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4 whitespace-normal text-sm leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{t.role}</p>
                                </div>
                                {t.verified && (
                                    <span className="text-[10px] bg-frog-green/10 text-frog-green px-2 py-1 rounded-full border border-frog-green/20">
                                        VÉRIFIÉ
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fade Edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#080c14] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#080c14] to-transparent pointer-events-none" />
        </section>
    );
}
