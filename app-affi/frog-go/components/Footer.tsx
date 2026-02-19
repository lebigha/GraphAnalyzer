"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation();

    return (
        <footer className="border-t border-white/5 bg-[#030305]">
            <div className="container mx-auto max-w-6xl px-4 py-12">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-xl font-black tracking-tighter">
                        <span className="text-white">FROG</span>
                        <span className="text-frog-green">AI</span>
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-center text-sm text-gray-500 mb-6">
                    © {currentYear} <span className="font-bold text-white">FROG</span><span className="text-frog-green font-bold">AI</span>. {t.footer.allRights}
                </div>

                {/* Links */}
                <div className="flex justify-center gap-6 text-sm text-gray-500 mb-8">
                    <Link href="/cgu" className="hover:text-white transition-colors">{t.footer.cgu}</Link>
                    <Link href="/confidentialite" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
                    <a href="mailto:contact@frogai.com" className="hover:text-white transition-colors">{t.footer.contact}</a>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    <span className="text-red-400 font-bold">{t.footer.warning}</span> {t.footer.disclaimer}
                </div>
            </div>
        </footer>
    );
}
