import { Modifier } from "./character";

const SPEC_SKILL = 5;

export const SPEC_COMBAT = {
  Blade: SPEC_SKILL,
  Blunt: SPEC_SKILL,
  Hand_to_Hand: SPEC_SKILL,
  Armorer: SPEC_SKILL,
  Block: SPEC_SKILL,
  Heavy_Armor: SPEC_SKILL,
  Athletics: SPEC_SKILL,
} as Modifier;

export const SPEC_MAGIC = {
  Illusion: SPEC_SKILL,
  Alchemy: SPEC_SKILL,
  Conjuration: SPEC_SKILL,
  Mysticism: SPEC_SKILL,
  Alteration: SPEC_SKILL,
  Destruction: SPEC_SKILL,
  Restoration: SPEC_SKILL,
} as Modifier;

export const SPEC_STEALTH = {
  Acrobatics: SPEC_SKILL,
  Light_Armor: SPEC_SKILL,
  Security: SPEC_SKILL,
  Sneak: SPEC_SKILL,
  Marksman: SPEC_SKILL,
  Mercantile: SPEC_SKILL,
  Speechcraft: SPEC_SKILL,
} as Modifier;
