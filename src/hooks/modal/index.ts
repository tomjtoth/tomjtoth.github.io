import { createContext, useEffect } from "react";

import useBuilder from "./builder";
import { ModalBuilder } from "../../types/modal";

const SOUND = new Audio("/modal.mp3");

export const CxModal = createContext<ModalBuilder | undefined>(undefined);

export default function useModal() {
  const res = useBuilder();

  const {
    modal: { prompt, silent, removeAfter },
    reset,
  } = res;

  if (prompt && silent === false) {
    console.debug("playing modal sound");
    SOUND.currentTime = 0;
    SOUND.play();
  }

  useEffect(() => {
    if (removeAfter !== undefined) {
      const id = setTimeout(reset, removeAfter);

      return () => clearTimeout(id);
    }
  }, [removeAfter]);

  return res;
}
