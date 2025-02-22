import { PropsWithChildren } from "react";

import "./modal.css";

import Buttons from "./Buttons";
import useLogic, { CxModal } from "./logic";

export function Modal({ children }: PropsWithChildren) {
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
            className: "modal-blur print:hidden",
            onClick: reset,
          }}
        >
          <div
            {...{
              className: "modal p-4 border rounded",
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
