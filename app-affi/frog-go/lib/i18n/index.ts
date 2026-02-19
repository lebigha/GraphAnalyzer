"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import fr from "./fr";
import en from "./en";
import type { Translations } from "./fr";

export type Lang = "fr" | "en";

const translations: Record<Lang, Translations> = { fr, en };

interface I18nContextType {
    t: Translations;
    lang: Lang;
    setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextType>({
    t: en as Translations,
    lang: "en",
    setLang: () => { },
});

const STORAGE_KEY = "frog_lang";

export function LanguageProvider({ children }: { children: ReactNode }): React.ReactNode {
    const [lang, setLangState] = useState<Lang>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
        if (stored && (stored === "fr" || stored === "en")) {
            setLangState(stored);
        }
        setMounted(true);
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
        document.documentElement.lang = newLang;
    };

    // Avoid hydration mismatch — render FR (default) until mounted
    const t = mounted ? translations[lang] : (en as Translations);

    return React.createElement(
        I18nContext.Provider,
        { value: { t, lang, setLang } },
        children
    );
}

export function useTranslation() {
    return useContext(I18nContext);
}

export { fr, en, translations };
export type { Translations };
