import { ModalBuilder } from "./modal";

export type BugState = {
  transition?: string;
  position: number | string;
  filtered: boolean;
};

export type UseLuxor = State & {
  modal: ModalBuilder;
  toggleLocked: () => void;

  moveBug: (position: number | string, fast: boolean) => void;
  hideBug: () => void;
  resetBug: () => void;

  addNum: (num: number) => void;
  update: (arr: number[]) => void;
  rmLastNum: () => void;
  clearNums: () => void;

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
  locked: boolean;
  bug: BugState;
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
