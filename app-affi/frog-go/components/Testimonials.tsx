"use client";

import { Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Testimonials() {
    const { t } = useTranslation();

    const testimonials = [
        { name: "Marc D.", role: "Forex Trader", text: t.testimonials.t1, verified: true },
        { name: "Sarah L.", role: "Crypto Trader", text: t.testimonials.t2, verified: true },
        { name: "Thomas R.", role: "Swing Trader", text: t.testimonials.t3, verified: true },
        { name: "Julie P.", role: "Day Trader", text: t.testimonials.t4, verified: true },
        { name: "Kevin M.", role: "Scalper", text: t.testimonials.t5, verified: true },
    ];

    return (
        <section className="py-24 px-4 bg-[#05070a]">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">
                        {t.testimonials.title1} <span className="text-red-400">{t.testimonials.titleLose}</span>.
                        <br />
                        {t.testimonials.title2} <span className="text-frog-green">{t.testimonials.titleTrade}</span>.
                    </h2>
                    <p className="text-gray-400">{t.testimonials.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((item, i) => (
                        <div key={i} className="glass-card p-6 hover:border-frog-green/30 transition-all duration-300 group">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-frog-green fill-frog-green" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-4 leading-relaxed">"{item.text}"</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.role}</p>
                                </div>
                                {item.verified && (
                                    <span className="text-[10px] font-mono text-frog-green bg-frog-green/10 px-2 py-1 rounded-full">
                                        ✓ {t.testimonials.verified}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
