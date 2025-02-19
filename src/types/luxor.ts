export type BugState = {
  transition?: string;
  position: number | string;
  filtered: boolean;
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
