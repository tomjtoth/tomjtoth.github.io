import { State as ArxFatalisState } from "./arx-fatalis";
import { Active } from "./lyrics";

// type NumId = {
//   id: number;
// };

type StrId = {
  id: string;
};

export type Lyrics = {
  active: Active;
};

export type ArxFatalis = Omit<ArxFatalisState, "score">;

export type LuxorNumbers = {
  pickedNums: number[];
};

export type MiscData = StrId & (Lyrics | ArxFatalis | LuxorNumbers);
