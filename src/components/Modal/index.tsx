import { createContext, PropsWithChildren, useState } from "react";

import "./modal.css";

import { ModalType, setModalType } from "../../types/modal";
import Buttons from "./Buttons";

const SOUND = new Audio("/modal.mp3");

export const CxModal = createContext<
  | {
      modal?: ModalType;
      setModal: setModalType;
    }
  | undefined
>(undefined);

export default function Modal({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<ModalType | undefined>(undefined);

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     setModal(undefined);
  //   }, 3000);

  //   return () => clearTimeout(id);
  // }, [modal]);

  let modalDiv;

  if (modal) {
    const { prompt, lang } = modal;

    modalDiv = (
      <div
        {...{
          id: "modal-blur",
          onClick: () => setModal(undefined),
        }}
      >
        <div
          {...{
            id: "modal",
            className: "padded bordered",
            lang,
            onClick: (evt) => {
              if (evt.target === evt.currentTarget) evt.stopPropagation();
            },
          }}
        >
          {prompt}
          <Buttons />
        </div>
      </div>
    );

    SOUND.currentTime = 0;
    SOUND.play();
  }

  return (
    <CxModal.Provider value={{ modal, setModal }}>
      {modalDiv}
      {children}
    </CxModal.Provider>
  );
}
