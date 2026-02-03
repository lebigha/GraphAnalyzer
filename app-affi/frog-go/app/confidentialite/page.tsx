"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Confidentialite() {
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
                <h1 className="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
                <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : Janvier 2026</p>

                <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed space-y-6">

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 1 - Collecte des Données</h2>
                        <p>
                            Dans le cadre de l'utilisation du service Frog AI, nous collectons les données suivantes :
                            les images de graphiques soumises pour analyse (traitées de manière éphémère), les données
                            de navigation stockées localement dans votre navigateur, ainsi que les informations de
                            paiement en cas de souscription à un abonnement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 2 - Traitement des Images</h2>
                        <p>
                            Les images soumises au service sont transmises de manière sécurisée à notre fournisseur
                            d'intelligence artificielle pour analyse. Elles ne sont pas stockées de manière permanente
                            sur nos serveurs et sont supprimées après traitement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 3 - Finalité du Traitement</h2>
                        <p>
                            Les données collectées sont utilisées aux fins suivantes : fourniture du service d'analyse,
                            amélioration de la qualité des analyses, gestion des abonnements et communication avec
                            les utilisateurs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 4 - Sous-traitants</h2>
                        <p>
                            Pour assurer le fonctionnement du service, nous faisons appel aux prestataires suivants :
                            Groq (traitement IA), Vercel (hébergement), Stripe (paiements). Ces prestataires sont soumis
                            à des obligations contractuelles de confidentialité.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 5 - Sécurité</h2>
                        <p>
                            Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger
                            vos données : chiffrement des communications (HTTPS/TLS), absence de stockage permanent
                            des images, sécurisation des clés d'accès.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 6 - Vos Droits</h2>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
                            droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition
                            concernant vos données personnelles. Pour exercer ces droits, contactez : privacy@frogai.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 7 - Cookies</h2>
                        <p>
                            Le service utilise des cookies techniques strictement nécessaires à son fonctionnement.
                            Aucun cookie de traçage publicitaire n'est déposé sans votre consentement préalable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Article 8 - Contact</h2>
                        <p>
                            Pour toute question relative à la protection de vos données personnelles, vous pouvez
                            contacter notre délégué à la protection des données à l'adresse : privacy@frogai.com
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
