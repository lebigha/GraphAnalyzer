"use client";

import { useTranslation, type Lang } from "@/lib/i18n";

export default function LanguageSwitcher() {
    const { lang, setLang } = useTranslation();

    const toggle = () => {
        setLang(lang === "fr" ? "en" : "fr");
    };

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-xs font-bold tracking-wide text-gray-300 hover:text-white cursor-pointer"
            aria-label="Switch language"
        >
            <span className={lang === "fr" ? "opacity-100" : "opacity-40"}>🇫🇷</span>
            <span className="text-white/20">/</span>
            <span className={lang === "en" ? "opacity-100" : "opacity-40"}>🇬🇧</span>
        </button>
    );
}
