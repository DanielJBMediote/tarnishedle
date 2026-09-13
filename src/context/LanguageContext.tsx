import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import EN from "../i18n/en-US.json";
import PT_BR from "../i18n/pt-BR.json";
import type { Effect, Element } from "../data/weapons";

export type Language = "pt" | "en";

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  getEffectNames: (effects: Effect[]) => string[];
  getElementNames: (effects: Element[]) => string[];
  getDataValue: (key: string, fallback?: string) => string;
};

interface TranslationData {
  [key: string]: string | TranslationData;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "pt";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "pt" ? "en" : "pt"));
  };

  const getDataValue = (key: string, fallback = key): string => {
    const value = key.split(".").reduce<string | TranslationData | undefined>(
      (current, part) => (typeof current === "object" ? current[part] : undefined),
      data,
    );

    return typeof value === "string" ? value : fallback;
  };

  const getEffectNames = (effects: Effect[]): string[] => {
    return effects.map((effect) => getDataValue(effect));
  };

  const getElementNames = (elements: Element[]): string[] => {
    return elements.map((element) => getDataValue(element));
  };

  const data = (language == "pt") ? PT_BR : EN;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, getEffectNames, getElementNames, getDataValue }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}