import { MouseEventHandler } from "react";
import { RE, Rune } from "./runes";

export type State = {
  score: number;
  castSpells: number[];
};

export type setQueueType = React.Dispatch<React.SetStateAction<RE[]>>;

export type RuneProps = { rune: Rune; onClick?: MouseEventHandler };
export type LogicProps = { queue: RE[]; setQueue: setQueueType };
