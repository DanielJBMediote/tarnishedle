import type { Weapon } from '../data/weapons';
import type { MatchingResult } from '../utils/utils';

export type MatchFields = {
  type: boolean;
  scaling: MatchingResult;
  element: MatchingResult;
  effects: MatchingResult;
  source: boolean;
};

export type Guess = {
  weapon: Weapon;
  matches: MatchFields;
};