import { createContext, PropsWithChildren, useEffect } from "react";

import "./modal.css";

import { ModalBuilder } from "../../types/modal";
import Buttons from "./Buttons";
import useBuilder from "./builder";

const SOUND = new Audio("/modal.mp3");

export const CxModal = createContext<ModalBuilder | undefined>(undefined);

export default function Modal({ children }: PropsWithChildren) {
  const builder = useBuilder();
  const { prompt, silent, removeAfter } = builder.modal;

  if (prompt && silent === false) {
    console.debug("playing modal sound");
    SOUND.currentTime = 0;
    SOUND.play();
  }

  useEffect(() => {
    if (removeAfter !== undefined) {
      const id = setTimeout(() => {
        builder.reset();
      }, removeAfter);

      return () => clearTimeout(id);
    }
  }, [removeAfter]);

  return (
    <CxModal.Provider value={builder}>
      {prompt && (
        <div
          {...{
            className: "modal-blur",
            onClick: () => builder.reset(),
          }}
        >
          <div
            {...{
              className: "modal padded bordered",
              lang: builder.modal.lang,
              onClick: (evt) => {
                if (evt.target === evt.currentTarget) evt.stopPropagation();
              },
            }}
          >
            {prompt}
            <Buttons />
          </div>
        </div>
      )}
      {children}
    </CxModal.Provider>
  );
}
