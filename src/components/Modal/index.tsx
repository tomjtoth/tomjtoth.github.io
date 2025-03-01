import { PropsWithChildren } from "react";

import Buttons from "./Buttons";
import useLogic, { CxModal } from "./logic";

export function ModalProvider({ children }: PropsWithChildren) {
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
            className: "bg-blur print:hidden",
            onClick: reset,
          }}
        >
          <div
            {...{
              className:
                "fixed z-20 top-1/2 left-1/2 -translate-1/2 p-4 text-center select-none bg-bg-0 border rounded",
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
