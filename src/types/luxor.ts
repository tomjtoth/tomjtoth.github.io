import { ModalBuilder } from "./modal";

export type BugState = {
  transition?: string;
  position: number | string;
  filtered: boolean;
};

export type SetBugType = React.Dispatch<React.SetStateAction<BugState>>;

export type TCxLuxor = {
  modal: ModalBuilder;
  locked: boolean;
  toggleLocked: () => void;

  bug: BugState;
  moveBug: (position: number | string, fast: boolean) => void;
  hideBug: () => void;
  resetBug: () => void;

  pickedNums: number[];
  addNum: (num: number) => void;
  update: (arr: number[]) => void;
  rmLastNum: () => void;
  clearNums: () => void;

  fields: Field[];
  addField: (id: number) => void;
  rmField: (id: number) => void;
};

export type Field = {
  id: number;
  order: number;
  rows: number[][];
  importedAt?: number;
};

export type FieldImport = Omit<Field, "id" | "order">;

export type State = {
  fields: Field[];
  pickedNums: number[];
};

export type TableBodyProps = {
  rows: number[][];
  fieldId: number;
};

export const EMPTY_FIELD = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
