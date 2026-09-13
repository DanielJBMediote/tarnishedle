import { useState, type FormEvent } from 'react';
import type { Weapon } from '../data/weapons';
import { useLanguage } from '../context/LanguageContext';

type WeaponSearchProps = {
  query: string;
  suggestions: Weapon[];
  disabled: boolean;
  onQueryChange: (query: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelect: (weapon: Weapon) => void;
  onClear: () => void;
};

export function WeaponSearch({
  query,
  suggestions,
  disabled,
  onQueryChange,
  onSubmit,
  onSelect,
  onClear,
}: WeaponSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {getDataValue} = useLanguage();

  return (
    <form className="relative mb-13 max-[700px]:mb-9.5" onSubmit={onSubmit}>
      <label className="mb-2.5 block text-[14px] tracking-wider text-[#d2cfbf]" htmlFor="weapon-search">Choose your guess</label>
      <div className="flex w-full items-center border border-[#56604d] bg-[rgba(17,20,17,.7)] transition-shadow focus-within:border-[#cfb86d] focus-within:shadow-[0_0_0_3px_rgba(207,184,109,.1)]">
        <span className="pl-4.5 text-center font-sans text-[29px] leading-none text-[#cfb86d]" aria-hidden="true">⌕</span>
        <input
          className="w-full border-0 bg-transparent px-4 py-4.25 font-serif text-base text-[#f1e9d1] outline-none placeholder:text-[#777e70]"
          id="weapon-search"
          type="search"
          placeholder="Type a weapon name..."
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setIsOpen(true);
          }}
          disabled={disabled}
          autoComplete="off"
        />
        {query && <button type="button" className="mr-2 border-0 bg-transparent text-2xl leading-none text-[#a9ad9d]" onClick={onClear} aria-label="Clear search">×</button>}
        <button className="self-stretch border-0 border-l border-[#56604d] bg-[#cfb86d] px-5.5 font-sans text-[13px] font-semibold tracking-[.04em] text-[#171a14] disabled:cursor-not-allowed disabled:opacity-40 max-[700px]:px-3.25" type="submit" disabled={disabled || !query}>Search</button>
      </div>
      {isOpen && suggestions.length > 0 && !disabled && (
        <div className="absolute inset-x-0 top-full z-20 grid max-h-80 overflow-y-auto overscroll-contain border border-t-0 border-[#56604d] bg-[#1b211b] shadow-[0_12px_24px_rgba(0,0,0,.35)]" role="listbox" aria-label="Weapon suggestions">
          {suggestions.map((weapon) => (
            <button className="border-0 border-b border-[rgba(72,81,68,.65)] bg-transparent px-4.5 py-3.25 text-left text-[#d9d5c5] hover:bg-[#cfb86d] hover:text-[#171a14]" type="button" role="option" key={weapon.name} onClick={() => { onSelect(weapon); setIsOpen(false); }}>

              {getDataValue(`weapons.${weapon.name}`, weapon.name)}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}