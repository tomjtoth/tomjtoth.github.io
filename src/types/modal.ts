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

type Button = [Text | string, MouseEventHandler?];

export type ModalType = {
  prompt?: ReactNode;
  lang?: Language;
  buttons: Button[];
  silent?: boolean;
  removeAfter?: number;
};

export type setModalType = React.Dispatch<
  React.SetStateAction<ModalType | undefined>
>;

export type ModalBuilder = {
  _buffer: ModalType;
  modal: ModalType;

  en: () => ModalBuilder;
  fi: () => ModalBuilder;
  hu: () => ModalBuilder;
  // lang: (lang: string) => ModalBuilder;

  ok: (onClick?: MouseEventHandler) => ModalBuilder;
  cancel: (onClick?: MouseEventHandler) => ModalBuilder;
  yes: (onClick?: MouseEventHandler) => ModalBuilder;
  no: (onClick?: MouseEventHandler) => ModalBuilder;
  button: (text: string, onClick?: MouseEventHandler) => ModalBuilder;

  silent: () => ModalBuilder;
  removeAfter: (ms: number) => ModalBuilder;

  prompt: (prompt: ReactNode) => void;
};
