import { createContext, PropsWithChildren } from "react";

import "./modal.css";

import { ModalBuilder } from "../../types/modal";
import Buttons from "./Buttons";
import useBuilder from "./builder";

export const CxModal = createContext<ModalBuilder | undefined>(undefined);

export default function Modal({ children }: PropsWithChildren) {
  const builder = useBuilder();
  const { prompt } = builder.modal;

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
