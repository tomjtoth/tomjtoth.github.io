export { Rune, RuneEnum } from "./runes";
export { Spell, SpellEnum } from "./spells";

export type State = {
  loaded: boolean;
  score: number;
  castSpells: number[];
};
