import { Active } from "../components/Lyrics/types";

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
