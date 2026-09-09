import { useEffect, useState } from "react";
import { API_URL, type Weapon, type WeaponsResponse } from "../data/weapons";
import clsx from "clsx";
import type { MatchFields } from "./gameTypes";
import arrowUp from "../assets/arrow-up.svg";
import arrowDown from "../assets/arrow-down.svg";

type WeaponRowProps = {
  weapon: Weapon;
  targetWeight: number;
  matches: MatchFields;
  isCorrectName: boolean;
};

const weaponCellClasses =
  "block min-w-0 text-center break-words px-1.75 py-4 text-sm leading-[1.2] text-[#eee8d7]";

export function WeaponRow({ weapon, targetWeight, matches, isCorrectName }: WeaponRowProps) {
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    const loadImage = async () => {
      try {
        // A API e usada somente para a imagem da arma ja exibida na tabela.
        const response = await fetch(`${API_URL}?name=${encodeURIComponent(weapon.name)}&limit=1`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const result = (await response.json()) as WeaponsResponse;
        setImage(result.data[0]?.image);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setImage(undefined);
      }
    };

    void loadImage();
    return () => controller.abort();
  }, [weapon.name]);

  return (
    <div
      className={clsx("grid grid-cols-11 min-h-22 items-center gap-1.5 py-3.25",
        "border-t border-[rgba(72,81,68,.65)] font-sans text-sm text-[#c3c6b8] hover:bg-[rgba(207,184,109,.06)] max-[700px]:min-h-19.5 max-[700px]:grid-cols-[52px_1fr_auto] max-[700px]:gap-3 max-[700px]:px-2 max-[700px]:py-2.75")}
      role="row"
    >
      {/* Weapon Image */}
      <div
        className="grid size-14 ml-6 max-[700px]:size-12 place-items-center overflow-hidden border border-[#5f644d] bg-[radial-gradient(circle,#4d5437,#20251d_70%)]"
        aria-label={`${weapon.name} image`}
        role="img"
      >
        {image && <img className="size-full object-contain" src={image} alt={`${weapon.name} weapon`} />}
      </div>
      {/* Weapon Name */}
      <span
        title={weapon.name}
        className={clsx(
          "col-span-2",
          weaponCellClasses,
          isCorrectName
            ? "bg-[rgba(92,145,76,.48)]"
            : "bg-[rgba(145,69,54,.42)]",
        )}
      >
        {weapon.name}
      </span>
      {/* Weapon Type */}
      <span
        className={clsx(
          weaponCellClasses,
          "whitespace-normal col-span-2",
          matches.type
          ? "bg-[rgba(92,145,76,.48)]"
          : "bg-[rgba(145,69,54,.42)]",
        )}
        >
        {weapon.type}
      </span>
      {/* Weapon Weight */}
      <span className={clsx(weaponCellClasses, "inline-flex items-center justify-center gap-1 whitespace-nowrap")}>
        {weapon.weight.toFixed(2)}
        {weapon.weight < targetWeight && (
          <img src={arrowUp} className="size-3.5" alt="Target weapon is heavier" />
        )}
        {weapon.weight > targetWeight && (
          <img src={arrowDown} className="size-3.5" alt="Target weapon is lighter" />
        )}
      </span>
      {/* Weapon Scaling */}
      <span
        className={clsx(
          weaponCellClasses,
          matches.scaling === "full" && "bg-[rgba(92,145,76,.48)]",
          matches.scaling === "partial" && "bg-[rgba(207,137,48,.5)]",
          matches.scaling === "none" && "bg-[rgba(145,69,54,.42)]",
        )}
        >
        {weapon.scaling.join(" / ")}
      </span>
      {/* Weapon Elemnt */}
      <span
        className={clsx(
          weaponCellClasses,
          matches.element === "full" && "bg-[rgba(92,145,76,.48)]",
          matches.element === "partial" && "bg-[rgba(207,137,48,.5)]",
          matches.element === "none" && "bg-[rgba(145,69,54,.42)]",
        )}
        >
        {weapon.elements.join(" / ")}
      </span>
    {/* Weapon Effects */}
      <span
        className={clsx(
          "col-span-2",
          weaponCellClasses,
          matches.effects === "full" && "bg-[rgba(92,145,76,.48)]",
          matches.effects === "partial" && "bg-[rgba(207,137,48,.5)]",
          matches.effects === "none" && "bg-[rgba(145,69,54,.42)]",
        )}
        >
        {weapon.effects.join(" / ")}
      </span>
      {/* Weapon Source */}
      <span
        className={clsx(
          "text-center",
          weaponCellClasses,
          matches.source
            ? "bg-[rgba(92,145,76,.48)]"
            : "bg-[rgba(145,69,54,.42)]",
        )}
      >
        {weapon.dlc ? "DLC" : "Game Base"}
      </span>
    </div>
  );
}
