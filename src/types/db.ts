import { State } from "./arx-fatalis";
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

export type ArxFatalis = Omit<State, "score">;

export type LuxorPickedNums = {
  pickedNums: number[];
};

export type MiscData = StrId & (Lyrics | ArxFatalis);
