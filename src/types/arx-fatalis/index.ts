import { MouseEventHandler } from "react";
import { RE } from "./runes";

export type State = {
  score: number;
  castSpells: number[];
};

export type setQueueType = React.Dispatch<React.SetStateAction<RE[]>>;

export type RuneProps = { rune: RE; onClick?: MouseEventHandler };
export type CxRunesType = { queue: RE[]; setQueue: setQueueType } | undefined;
