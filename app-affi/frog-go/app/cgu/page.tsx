"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CGU() {
    return (
        <main className="min-h-screen bg-[#05070a] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-[#0a0a0a]">
                <div className="container mx-auto max-w-4xl px-4 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="text-3xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
                <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : Janvier 2026</p>

                <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed space-y-6">

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 1 - Objet</h2>
                        <p>
                            Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation du service Frog AI,
                            plateforme d'analyse de graphiques financiers assistée par intelligence artificielle. L'utilisation du
                            service implique l'acceptation pleine et entière des présentes conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 2 - Description du Service</h2>
                        <p>
                            Frog AI propose un service d'analyse technique de graphiques de trading utilisant des modèles
                            d'intelligence artificielle. Le service génère des indicateurs techniques, identifie des patterns
                            graphiques et fournit des niveaux de support et résistance à titre informatif.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 3 - Avertissement</h2>
                        <p>
                            Les analyses fournies par le service sont générées automatiquement et présentées à titre purement
                            informatif et éducatif. Elles ne constituent en aucun cas des conseils en investissement, des
                            recommandations d'achat ou de vente, ni des incitations à effectuer des transactions financières.
                            L'utilisateur reconnaît que toute décision d'investissement est prise sous sa seule responsabilité.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 4 - Responsabilité</h2>
                        <p>
                            L'éditeur du service décline toute responsabilité quant aux décisions prises par l'utilisateur
                            sur la base des analyses fournies. Le trading sur les marchés financiers comporte des risques
                            de perte en capital. L'utilisateur est invité à consulter un conseiller financier agréé avant
                            toute opération.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 5 - Propriété Intellectuelle</h2>
                        <p>
                            L'ensemble des éléments constituant le service (logos, graphismes, code source, algorithmes)
                            sont protégés par le droit de la propriété intellectuelle. Toute reproduction, même partielle,
                            est soumise à autorisation préalable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 6 - Modification des CGU</h2>
                        <p>
                            L'éditeur se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs
                            seront informés de toute modification substantielle. La poursuite de l'utilisation du service
                            après modification vaut acceptation des nouvelles conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 7 - Contact</h2>
                        <p>
                            Pour toute question relative aux présentes conditions, vous pouvez nous contacter à l'adresse :
                            contact@frogai.com
                        </p>
                    </section>

                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <Link href="/" className="text-frog-green hover:underline text-sm">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </main>
    );
}
