import { Active } from "./common";
import { setModalType } from "./modal";

export type ControlFormProps = {
  active: Active;
  setModal: setModalType;
};

type Step = string;

export type Item = {
  id: number;
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
  steps: Step[];
};

export type State = {
  recipes: Recipe[];
  items: Item[];
  active: Active;
};

export type StepsProps = {
  recId: string;
  steps: Step[];
  lang: "hu" | "fi" | undefined;
};
