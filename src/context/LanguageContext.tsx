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
  data: Record<string, string>;
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

  const getEffectNames = (effects: Effect[]): string[] => {
    const new_arr: string[] = [];

    effects.map(eff => {
      if (eff === "hemorrhage") new_arr.push(data["hemorrhage"]);
      if (eff === "poison") new_arr.push(data["poison"]);
      if (eff === "frostbite") new_arr.push(data["frostbite"]);
      if (eff === "scarlet_rot") new_arr.push(data["scarlet_rot"]);
      if (eff === "sleep") new_arr.push(data["sleep"]);
      if (eff === "madness") new_arr.push(data["madness"]);
      if (eff === "none") new_arr.push(data["none"]);
    })

    return new_arr
  }

  const getElementNames = (elements: Element[]): string[] => {
    const new_arr: string[] = [];

    elements.map(ele => {
      if (ele === "magic") new_arr.push(data["magic"]);
      if (ele === "fire") new_arr.push(data["fire"]);
      if (ele === "lightning") new_arr.push(data["lightning"]);
      if (ele === "holy") new_arr.push(data["holy"]);
      if (ele === "none") new_arr.push(data["none"]);
    })

    return new_arr
  }

  // const getWeaponType = (type: WeaponType): string => data[type as keyof typeof data] || type;

  const data = (language == "pt") ? PT_BR : EN;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, data, getEffectNames, getElementNames }}>
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