import weaponData from "./EldenRingWeaponsData.json";

export type Scaling = "STR" | "INT" | "DEX" | "FAI" | "ARC";
export type Effect = "Hemorrhage" | "Poison" | "Frostbite" | "Scarlet Rot" | "Sleep" | "Madness" | "None";
export type WeaponType = string;
export type Element = "None" | "Magic" | "Fire" | "Lightning" | "Holy";

export type Weapon = {
  name: string;
  type: WeaponType;
  weight: number;
  elements: Element[];
  scaling: Scaling[];
  effects: Effect[];
  dlc: boolean;
};

export type ApiWeapon = {
  name: string;
  image?: string;
};

export type WeaponsResponse = {
  data: ApiWeapon[];
};

type LocalWeapon = {
  Name: string;
  DLC: boolean;
  "Weapon Type": WeaponType;
  Weight: string;
  Physic: number;
  Magic: number;
  Fire: number;
  Lightning: number;
  Holy: number;
  "Scarlet Rot": number;
  Frostbite: number;
  Hemorrhage: number;
  Madness: number;
  Poison: number;
  Sleep: number;
};

const scalingByCategory: Record<string, Scaling[]> = {
  Axe: ["STR", "DEX"],
  Ballista: ["STR"],
  Bow: ["STR", "DEX"],
  "Beast Claw": ["STR", "DEX"],
  "Backhand Blade": ["DEX", "STR"],
  Claw: ["STR", "DEX"],
  "Colossal Sword": ["STR", "DEX"],
  "Colossal Weapon": ["STR"],
  Crossbow: ["STR", "DEX"],
  "Curved Greatsword": ["STR", "DEX"],
  "Curved Sword": ["STR", "DEX"],
  Dagger: ["DEX", "STR"],
  Fist: ["STR", "DEX"],
  "Glintstone Staff": ["INT"],
  "Glinstone Staff": ["INT"],
  "Sacred Seal": ["FAI"],
  Katana: ["DEX", "STR"],
  "Great Katana": ["DEX", "STR"],
  "Perfume Bottle": ["DEX", "INT"],
};

const getScaling = (weaponType: WeaponType): Scaling[] => {
  return scalingByCategory[weaponType] ?? ["STR", "DEX"];
};

const getElements = (weapon: LocalWeapon): Weapon["elements"] => {
  const elements: Element[] = [];
  if (weapon.Magic > 0) elements.push("Magic");
  if (weapon.Fire > 0) elements.push("Fire");
  if (weapon.Lightning > 0) elements.push("Lightning");
  if (weapon.Holy > 0) elements.push("Holy");
  return elements.length > 0 ? elements : ["None"];
};

const getEffects = (weapon: LocalWeapon): Effect[] => {
  const effects: Effect[] = [];
  if (weapon.Hemorrhage > 0) effects.push("Hemorrhage");
  if (weapon.Poison > 0) effects.push("Poison");
  if (weapon.Frostbite > 0) effects.push("Frostbite");
  if (weapon["Scarlet Rot"] > 0) effects.push("Scarlet Rot");
  if (weapon.Sleep > 0) effects.push("Sleep");
  if (weapon.Madness > 0) effects.push("Madness");
  return effects.length > 0 ? effects : ["None"];
};

const toWeapon = (localWeapon: LocalWeapon): Weapon => ({
  name: localWeapon.Name,
  type: localWeapon["Weapon Type"],
  weight: Number(localWeapon.Weight),
  elements: getElements(localWeapon),
  scaling: getScaling(localWeapon["Weapon Type"]),
  effects: getEffects(localWeapon),
  dlc: localWeapon.DLC,
});

export const weapons: Weapon[] = (weaponData as LocalWeapon[]).map(toWeapon);
export const API_URL = "https://eldenring.fanapis.com/api/weapons";
