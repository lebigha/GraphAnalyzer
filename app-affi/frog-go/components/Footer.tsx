"use client";

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 bg-[#05070a] py-8 mt-auto">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Logo & Copyright */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/frog-transparent-final.png"
                            alt="Frog AI"
                            className="w-8 h-8 object-contain"
                            style={{ imageRendering: 'pixelated' }}
                        />
                        <span className="text-sm text-gray-500">
                            © {currentYear} <span className="font-bold text-white">FROG</span><span className="text-frog-green font-bold">AI</span>. Tous droits réservés.
                        </span>
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link
                            href="/cgu"
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            CGU
                        </Link>
                        <Link
                            href="/confidentialite"
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            Confidentialité
                        </Link>
                        <a
                            href="mailto:contact@frogai.com"
                            className="text-gray-500 hover:text-frog-green transition-colors"
                        >
                            Contact
                        </a>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-xs text-gray-600 text-center max-w-2xl mx-auto">
                        ⚠️ <strong>Avertissement :</strong> Frog AI ne fournit pas de conseils financiers.
                        Le trading comporte des risques de perte en capital. Les analyses sont à titre indicatif uniquement.
                    </p>
                </div>
            </div>
        </footer>
    );
}
