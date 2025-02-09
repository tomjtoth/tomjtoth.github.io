import { MouseEventHandler, ReactNode } from "react";

export enum Language {
  En = "en",
  Fi = "fi",
  Hu = "hu",
}

export enum Text {
  Ok,
  Cancel,
  Yes,
  No,
}

type Button = [Text, MouseEventHandler?];

export type ModalType = {
  prompt: ReactNode;
  lang?: Language;
  buttons?: Button[];
};
