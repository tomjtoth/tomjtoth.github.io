export type BugState = {
  position: number | string;
  filtered: boolean;
  crawling: boolean;
};

export type SetBugType = React.Dispatch<React.SetStateAction<BugState>>;

export type CxLuxorType = {
  locked: boolean;
  toggleLocked: () => void;

  bug: BugState;
  moveBug: (position: number | string) => void;
  hideBug: () => void;
  resetBug: () => void;
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
