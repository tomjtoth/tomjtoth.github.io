import { setModalType } from "../Modal/types";

export type ControlFormProps = {
  active: string[];
  setModal: setModalType;
};

export type Item = {
  key: string;
  item: string;
};

export type Recipe = {
  title: string;
  url?: string;
  opts?: {
    lang: {
      title: string;
    };
  };
  items: string[];
  steps: string[];
};
