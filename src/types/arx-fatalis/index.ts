export * from "./runes";
export * from "./spells";

export type State = {
  loaded: boolean;
  score: number;
  castSpells: number[];
};
