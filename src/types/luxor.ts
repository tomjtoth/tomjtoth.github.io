import { setModalType } from "./modal";

export type bugState = {
  privacy: boolean;
  x: number | string;
  className?: string;
};

export type Field = {
  id: number;
  order: number;
  rows: number[][];
  importedAt?: number;
};

export type State = {
  fields: Field[];
  pickedNums: number[];
  locked: boolean;
  bug: bugState;
};

export type TableBodyProps = {
  rows: number[][];
  fieldId: number;
};

export type ControlFormProps = {
  setModal: setModalType;
};

export type PickedNumsLineProps = {
  setModal: setModalType;
};
