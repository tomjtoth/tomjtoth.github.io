import { createContext, PropsWithChildren } from "react";

import "./modal.css";

import { ModalBuilder } from "../../types/modal";
import Buttons from "./Buttons";
import useLogic from "./logic";

export const CxModal = createContext<ModalBuilder | undefined>(undefined);

export default function Modal({ children }: PropsWithChildren) {
  const {
    builder,
    reset,
    modal: { lang, prompt, buttons },
  } = useLogic();

  return (
    <CxModal.Provider value={builder}>
      {prompt && (
        <div
          {...{
            className: "modal-blur",
            onClick: reset,
          }}
        >
          <div
            {...{
              className: "modal padded bordered",
              lang,
              onClick: (evt) => {
                if (evt.target === evt.currentTarget) evt.stopPropagation();
              },
            }}
          >
            {prompt}
            <Buttons {...{ buttons, lang }} />
          </div>
        </div>
      )}
      {children}
    </CxModal.Provider>
  );
}
