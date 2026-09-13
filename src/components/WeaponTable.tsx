import { useLanguage } from '../context/LanguageContext';
import type { Weapon } from '../data/weapons';
import type { Guess } from './gameTypes';
import { WeaponRow } from './WeaponRow';

type WeaponTableProps = {
  guesses: Guess[];
  targetWeapon: Weapon;
};

export function WeaponTable({ guesses, targetWeapon }: WeaponTableProps) {

  const {getDataValue} = useLanguage();

  return (
    <div className="w-full" role="table" aria-label="Weapon list">
      <div className="grid grid-cols-11 items-center px-4 pb-3 pt-4 text-center font-sans text-[10px] uppercase tracking-[.15em] text-[#7d8877] max-[700px]:hidden" role="row">
        <span>Image</span>
        <span className='col-span-2'>{getDataValue("name")}</span>
        <span className='col-span-2'>{getDataValue("type")}</span>
        <span>{getDataValue("weight")}</span>
        <span>{getDataValue("scaling")}</span>
        <span>{getDataValue("elements")}</span>
        <span className='col-span-2'>{getDataValue("effects")}</span>
        <span>{getDataValue("source")}</span>
      </div>
      {[...guesses].reverse().map(({ weapon, matches }) => (
        <WeaponRow key={weapon.name} weapon={weapon} targetWeight={targetWeapon.weight} matches={matches} isCorrectName={weapon.name === targetWeapon.name} />
      ))}
      {guesses.length === 0 && <p className="border-t border-[#485144] px-4.5 py-9.5 text-[#a9ad9d]">Your guesses will appear here.</p>}
    </div>
  );
}