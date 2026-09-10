import weaponData from "./EldenRingWeaponsData.json";

export type Scaling = "STR" | "INT" | "DEX" | "FAI" | "ARC";
export type Effect = "hemorrhage" | "poison" | "frostbite" | "scarlet_rot" | "sleep" | "madness" | "none";
export type WeaponType = string;

export type Element = "none" | "magic" | "fire" | "lightning" | "holy";

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
  weapon_name: string;
  is_dlc: boolean;
  weapon_type: WeaponType;
  weight: string;
  physic: number;
  magic: number;
  fire: number;
  lightning: number;
  holy: number;
  scarletRot: number;
  frostbite: number;
  hemorrhage: number;
  madness: number;
  poison: number;
  sleep: number;
};

const scalingByWeaponType: Record<string, Scaling[]> = {
  axe: ["STR", "DEX"],
  ballista: ["STR"],
  bow: ["STR", "DEX"],
  beast_claw: ["STR", "DEX"],
  backhand_blade: ["DEX", "STR"],
  claw: ["STR", "DEX"],
  colossal_sword: ["STR", "DEX"],
  colossal_weapon: ["STR"],
  crossbow: ["STR", "DEX"],
  curved_greatsword: ["STR", "DEX"],
  curved_sword: ["STR", "DEX"],
  dagger: ["DEX", "STR"],
  fist: ["STR", "DEX"],
  glintstone_staff: ["INT"],
  sacred_seal: ["FAI"],
  katana: ["DEX", "STR"],
  great_katana: ["DEX", "STR"],
  perfume_bottle: ["DEX", "INT"],
};

const getScaling = (weaponType: WeaponType): Scaling[] => {
  return scalingByWeaponType[weaponType] ?? ["STR", "DEX"];
};

const getElements = (weapon: LocalWeapon): Weapon["elements"] => {
  const elements: Element[] = [];
  if (weapon.magic > 0) elements.push("magic");
  if (weapon.fire > 0) elements.push("fire");
  if (weapon.lightning > 0) elements.push("lightning");
  if (weapon.holy > 0) elements.push("holy");
  return elements.length > 0 ? elements : ["none"];
};

const getEffects = (weapon: LocalWeapon): Effect[] => {
  const effects: Effect[] = [];
  if (weapon.hemorrhage > 0) effects.push("hemorrhage");
  if (weapon.poison > 0) effects.push("poison");
  if (weapon.frostbite > 0) effects.push("frostbite");
  if (weapon.scarletRot > 0) effects.push("scarlet_rot");
  if (weapon.sleep > 0) effects.push("sleep");
  if (weapon.madness > 0) effects.push("madness");
  return effects.length > 0 ? effects : ["none"];
};

const toWeapon = (localWeapon: LocalWeapon): Weapon => ({
  name: localWeapon.weapon_name,
  type: localWeapon.weapon_type,
  weight: Number(localWeapon.weight),
  elements: getElements(localWeapon),
  scaling: getScaling(localWeapon.weapon_type),
  effects: getEffects(localWeapon),
  dlc: localWeapon.is_dlc,
});

export const weapons: Weapon[] = (weaponData as LocalWeapon[]).map(toWeapon);
export const API_URL = "https://eldenring.fanapis.com/api/weapons";
