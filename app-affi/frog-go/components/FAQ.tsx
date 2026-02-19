"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    const faqItems = [
        { question: t.faq.q1, answer: t.faq.a1 },
        { question: t.faq.q2, answer: t.faq.a2 },
        { question: t.faq.q3, answer: t.faq.a3 },
        { question: t.faq.q4, answer: t.faq.a4 },
        { question: t.faq.q5, answer: t.faq.a5 },
    ];

    return (
        <section className="py-24 px-4 bg-[#05070a]">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">{t.faq.title}</h2>
                    <p className="text-gray-400">{t.faq.subtitle}</p>
                </div>

                <div className="space-y-3">
                    {faqItems.map((item, i) => (
                        <div key={i} className="glass-card overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-bold text-white pr-4">{item.question}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                            </button>
                            {openIndex === i && (
                                <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
