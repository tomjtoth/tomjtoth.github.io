import { ReactNode } from "react";

type LanguageSelection = "hu" | "fi" | "en";

export type ModalType =
  | undefined
  | {
      prompt: ReactNode;
      onSuccess?: CallableFunction;
      lang?: LanguageSelection;
      buttons?: string;
    };

export type setModalType = React.Dispatch<React.SetStateAction<ModalType>>;

export type ModalProps = {
  modal: ModalType;
  setModal: setModalType;
  timeOut?: number;
};

export type ModalButtonsProps = {
  lang: LanguageSelection;
  buttons: string;
};
