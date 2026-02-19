"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Confidentialite() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-[#05070a] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0a]">
                <div className="container mx-auto max-w-4xl px-4 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        {t.privacy.back}
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold mb-2">{t.privacy.title}</h1>
                <p className="text-gray-500 text-sm mb-10">{t.privacy.lastUpdate}</p>

                <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed space-y-6">

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art1Title}</h2>
                        <p>{t.privacy.art1}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art2Title}</h2>
                        <p>{t.privacy.art2}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art3Title}</h2>
                        <p>{t.privacy.art3}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art4Title}</h2>
                        <p>{t.privacy.art4}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art5Title}</h2>
                        <p>{t.privacy.art5}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art6Title}</h2>
                        <p>{t.privacy.art6}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art7Title}</h2>
                        <p>{t.privacy.art7}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t.privacy.art8Title}</h2>
                        <p>{t.privacy.art8}</p>
                    </section>

                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <Link href="/" className="text-frog-green hover:underline text-sm">
                        {t.privacy.backHome}
                    </Link>
                </div>
            </div>
        </main>
    );
}
