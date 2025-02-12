import { MouseEventHandler } from "react";
import { Rune } from "./runes";

export type State = {
  score: number;
  castSpells: number[];
};

export type ImgProps = { rune: Rune; onClick?: MouseEventHandler };
