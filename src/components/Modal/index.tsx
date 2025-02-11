import { PropsWithChildren } from "react";

import "./modal.css";

import Buttons from "./Buttons";
import useModal, { CxModal } from "../../hooks/modal";

export default function Modal({ children }: PropsWithChildren) {
  const {
    builder,
    reset,
    modal: { lang, prompt, buttons },
  } = useModal();

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
