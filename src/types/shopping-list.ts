import { setModalType } from "./modal";

export type ControlFormProps = {
  active: string[];
  setModal: setModalType;
};

type Step = string;

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
  steps: Step[];
};

export type StepsProps = {
  recId: string;
  steps: Step[];
  lang: "hu" | "fi" | undefined;
};
