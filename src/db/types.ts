import { Active } from "../types/lyrics";

// type NumId = {
//   id: number;
// };

type StrId = {
  id: string;
};

export type Lyrics = {
  active: Active;
};

export type LuxorPickedNums = {
  pickedNums: number[];
};

export type MiscData = StrId & Lyrics;
