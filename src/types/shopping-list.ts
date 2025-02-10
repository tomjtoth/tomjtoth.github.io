import { Active } from "./common";
import { Language } from "./modal";

type Step = string;

export type CxShoppingType =
  | undefined
  | {
      loaded: boolean;
      recipes: Recipe[];

      items: Item[];
      addItem: (name: string) => void;
      rmItem: (id: string, name: string) => void;

      active: string[];
      toggleActive: (id: string) => void;
      resetActive: () => void;
    };

export type Item = {
  id: number;
  name: string;
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
  steps: Step[];
  lang: Language | undefined;
};
