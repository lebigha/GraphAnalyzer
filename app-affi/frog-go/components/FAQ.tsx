"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "C'est une arnaque comme les signaux Telegram ?",
        answer: "Non. Frog AI ne vend pas de signaux. Vous uploadez VOTRE graphique, vous recevez VOTRE analyse. Pas de groupe privé, pas de \"call\" mystérieux. Juste une IA qui lit le prix comme un pro et vous donne les niveaux clés. Vous gardez le contrôle total."
    },
    {
        question: "Et si l'IA se trompe ?",
        answer: "Aucun outil n'est parfait à 100%. Frog AI affiche un taux de précision de 89% sur l'identification des tendances et niveaux clés (testé sur +12 000 graphiques). Utilisez-le comme un second avis pour valider votre analyse, pas comme une boule de cristal."
    },
    {
        question: "C'est vraiment gratuit ?",
        answer: "Oui ! 3 analyses gratuites par jour, aucune carte bancaire requise, aucune inscription. On croit en la valeur d'abord. Si vous voulez des scans illimités, une version Pro sera disponible bientôt."
    },
    {
        question: "Ça marche sur Crypto, Forex ET Actions ?",
        answer: "Absolument. L'IA analyse la structure du prix : supports, résistances, tendances. Ces concepts sont universels. Bitcoin en 15min, EUR/USD en H4, ou Tesla en Daily — même logique, même précision."
    },
    {
        question: "Mes graphiques sont-ils privés ?",
        answer: "100%. Vos images sont traitées de façon éphémère par notre moteur d'IA sécurisé. Aucune donnée n'est stockée, vendue ou partagée. Vous restez anonyme."
    }
];

export default function FAQ() {
    return (
        <section className="py-24 px-4 bg-[#05070a] relative z-10">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Questions Fréquentes</h2>
                    <p className="text-gray-400">Tout ce que vous devez savoir sur le trading avec Frog AI.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer, defaultOpen = false }: { question: string, answer: string, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="font-bold text-white text-lg pr-8">{question}</span>
                <span className={`p-2 rounded-full border border-white/10 shrink-0 ${isOpen ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 text-base">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
