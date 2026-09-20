import { useEffect, useState, type FormEvent } from "react";
import { VictoryPanel } from "./components/VictoryPanel";
import type { Guess } from "./components/gameTypes";
import { WeaponSearch } from "./components/WeaponSearch";
import { WeaponTable } from "./components/WeaponTable";
import { weapons, type Weapon } from "./data/weapons";
import { useLanguage } from "./context/LanguageContext";
import { getMatchingResult } from "./utils/utils";

const normalize = (value: string) => value.toLowerCase().trim();

function App() {
  const { language, toggleLanguage, getDataValue } = useLanguage();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Weapon[]>([]);
  const [targetWeapon, setTargetWeapon] = useState<Weapon | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading] = useState(false);

  useEffect(() => {
    setTargetWeapon(
      weapons[Math.floor(Math.random() * weapons.length)] ?? null,
    );
  }, []);

  useEffect(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery || isLoading) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuggestions(
        weapons
          .filter((weapon) =>
            normalize(
              getDataValue(`weapons.${weapon.name}`, weapon.name),
            ).includes(normalizedQuery),
          )
          .slice(0, 20),
      );
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [getDataValue, isLoading, language, query]);

  const chooseWeapon = (weapon: Weapon) => setQuery(weapon.name);

  const handleSubmitGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gameOver) return;

    const weapon = weapons.find(
      (item) =>
        normalize(item.name) === normalize(query) ||
        normalize(getDataValue(`weapons.${item.name}`, item.name)) ===
          normalize(query),
    );
    if (
      !weapon ||
      !targetWeapon ||
      guesses.some((guess) => guess.weapon.name === weapon.name)
    )
      return;

    const scaling = getMatchingResult(weapon.scaling, targetWeapon.scaling);
    const element = getMatchingResult(weapon.elements, targetWeapon.elements);
    const effects = getMatchingResult(weapon.effects, targetWeapon.effects);

    const matches = {
      type: weapon.type === targetWeapon.type,
      scaling,
      element,
      effects,
      source: weapon.dlc === targetWeapon.dlc,
    };

    const nextGuesses = [...guesses, { weapon, matches }];
    setGuesses(nextGuesses);
    setQuery("");
    if (weapon.name === targetWeapon.name) setGameOver(true);
  };

  const resetGame = () => {
    setTargetWeapon(
      weapons[Math.floor(Math.random() * weapons.length)] ?? null,
    );
    setGuesses([]);
    setQuery("");
    setGameOver(false);
  };

  const score = Math.max(100, 1000 - (guesses.length - 1) * 100);

  return (
    <main className="relative min-h-screen min-w-[320px] overflow-hidden bg-[radial-gradient(circle_at_50%_-10%,#39412d_0,#1b211b_34%,#111411_72%)] font-serif text-[#eee8d7] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(220,198,130,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(220,198,130,.12)_1px,transparent_1px)] before:bg-size-[54px_54px] before:opacity-[.12] p-2">
      <div
        className="absolute -right-20 -top-60 size-115 rounded-full bg-[#ddc27c] opacity-[.08] blur-[14px]"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggleLanguage}
        className="rounded border cursor-pointer border-[#69745f] px-3 py-1 font-sans text-xs uppercase tracking-wider text-[#d8c98d] hover:bg-[#39412d]"
        aria-label="Change language"
      >
        {language === "pt" ? "EN" : "PT"}
      </button>
      <div className="mb-6 flex justify-end"></div>
      <section className="relative mx-auto w-[calc(100%-40px)] max-w-7xl py-20.5 max-[700px]:w-[calc(100%-28px)] max-[700px]:max-w-135 max-[700px]:pt-13">
        <header className="mb-10.5 flex flex-col items-center text-center">
          <h1 className="m-0 text-[clamp(48px,8vw,88px)] font-normal leading-[.95] tracking-[.02em] text-[#f1e9d1]">
            Tarnishedle
          </h1>
          <p className="mt-5.5 max-w-115 text-[17px] leading-[1.55] text-[#a9ad9d] max-[700px]:text-[15px]">
            {getDataValue(
              "game_description",
              "Guess the hidden armament. Each attempt reveals how close you are.",
            )}
          </p>
        </header>

        <WeaponSearch
          query={query}
          suggestions={suggestions}
          disabled={gameOver || isLoading}
          onQueryChange={setQuery}
          onSubmit={handleSubmitGuess}
          onSelect={chooseWeapon}
          onClear={() => setQuery("")}
        />

        <div className="flex items-baseline justify-between border-b border-[#485144] pb-3.5 text-[19px] text-[#e5dcc5]">
          <span className="text-center font-sans text-[12px] uppercase tracking-[.06em] text-[#818b7b]">
            {guesses.length} {getDataValue("attempt", "attempt")}
            {guesses.length > 1 ? "s" : ""}
          </span>
        </div>

        {targetWeapon ? (
          <WeaponTable guesses={guesses} targetWeapon={targetWeapon} />
        ) : (
          <p className="border-t border-[#485144] px-4.5 py-9.5 text-[#a9ad9d]">
            {isLoading ? "Loading weapons..." : "No weapons available."}
          </p>
        )}
        {gameOver && targetWeapon && (
          <VictoryPanel
            targetWeapon={targetWeapon}
            score={score}
            attempts={guesses.length}
            onReset={resetGame}
          />
        )}
      </section>
    </main>
  );
}

export default App;
