import type { Weapon } from '../data/weapons';

export type ScalingMatch = 'none' | 'partial' | 'full';
export type ElementMatch = 'none' | 'partial' | 'full';
export type EffectMatch = 'none' | 'partial' | 'full';

export type MatchFields = {
  type: boolean;
  scaling: ScalingMatch;
  element: ElementMatch;
  effects: EffectMatch;
  source: boolean;
};

export type Guess = {
  weapon: Weapon;
  matches: MatchFields;
};