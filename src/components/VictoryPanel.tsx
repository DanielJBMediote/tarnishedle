import { useLanguage } from '../context/LanguageContext';
import type { Weapon } from '../data/weapons';

interface VictoryPanelProps {
  targetWeapon: Weapon;
  score: number;
  attempts: number;
  onReset: () => void;
};

export function VictoryPanel({ targetWeapon, score, attempts, onReset }: VictoryPanelProps) {
  const { getDataValue } = useLanguage();

  function formatVictoryMessage() {
    const messageTemplate = getDataValue("victory_description", "{weaponName} was the weapon. You scored {score} points in {attempts} attempt(s).");
    return messageTemplate
      .replace("{weaponName}", getDataValue(`weapons.${targetWeapon.name}`, targetWeapon.name))
      .replace("{score}", score.toString())
      .replace("{attempts}", attempts.toString());
  }

  return (
    <div className="mt-7 flex items-center gap-4 border border-[#a68d4e] bg-[rgba(84,91,48,.28)] p-[18px_20px] max-[700px]:items-start max-[700px]:flex-wrap">
      <span className="text-center text-[28px] text-[#e5c86f]">✦</span>
      <div>
        <strong className="font-serif text-xl font-normal text-[#f1e9d1]">
          {getDataValue("victory_title", "Well guessed, Tarnished.")}
        </strong>
        <p className="mt-1.25 font-sans text-[13px] text-[#b9bdac]">
          {formatVictoryMessage()}
        </p>
      </div>
      <button className="ml-auto border cursor-pointer border-[#cfb86d] bg-transparent px-3.5 py-2 font-sans text-xs uppercase text-[#cfb86d] max-[700px]:ml-11" type="button" onClick={onReset}>{getDataValue("play_again", "Play again")}</button>
    </div>
  );
}