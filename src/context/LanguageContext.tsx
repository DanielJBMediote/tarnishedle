import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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

const PT_BR_WEAPON_OVERRIDES: Record<string, string> = {
  "weapons.Sword of St. Trina": "Espada de Sta. Trina",
  "weapons.Velvet Sword of St. Trina": "Espada de Veludo de Santa Trina",
  "weapons.St. Trina's Torch": "Tocha de Sta. Trina",
};

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
    if (language === "pt" && PT_BR_WEAPON_OVERRIDES[key]) {
      return PT_BR_WEAPON_OVERRIDES[key];
    }

    const separatorIndex = key.indexOf(".");
    if (separatorIndex !== -1) {
      const namespace = (data as TranslationData)[key.slice(0, separatorIndex)];
      const nestedKey = key.slice(separatorIndex + 1);

      if (typeof namespace === "object" && namespace !== null) {
        const nestedValue = namespace[nestedKey];
        if (typeof nestedValue === "string") return nestedValue;
      }
    }

    const parts = key.split(".");
    const value = parts.reduce<string | TranslationData | undefined>(
      (current, part, index) => {
        if (typeof current !== "object" || current === null) return undefined;

        const remainingKey = parts.slice(index).join(".");
        return current[remainingKey] ?? current[part];
      },
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

  const data = language == "pt" ? PT_BR : EN;

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        getEffectNames,
        getElementNames,
        getDataValue,
      }}
    >
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
