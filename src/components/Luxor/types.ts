import { setModalType } from "../Modal/types";

export type bugState = {
  privacy: boolean;
  x: number | string;
  className?: string;
};

export type Field = {
  id: string;
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
  fieldId: string;
};

export type ControlFormProps = {
  setModal: setModalType;
};
