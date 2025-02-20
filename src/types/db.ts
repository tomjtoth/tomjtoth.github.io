import { State as ArxFatalisState } from "./arx-fatalis";
import { BatMonConf as BatMonConf } from "./battery-monitor";
import { State as LuxorState } from "./luxor";
import { State as LyricsState } from "./lyrics";
import { State as ShoppingListState } from "./shopping-list";

type StrId = {
  id: string;
};

export type LuxorFields = Pick<LuxorState, "fields">;

export type LyricsActive = Pick<LyricsState, "active">;
export type ArxFatalisSpells = Pick<ArxFatalisState, "castSpells">;
export type LuxorNumbers = Pick<LuxorState, "pickedNums">;
export type ShoppingListActive = Pick<ShoppingListState, "active">;
export type MiscData = StrId &
  (
    | LyricsActive
    | ArxFatalisSpells
    | LuxorNumbers
    | ShoppingListActive
    | BatMonConf
  );
