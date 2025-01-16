import { useEffect } from "react";

import "./modal.css";

import Buttons from "./Buttons";
import { ModalProps } from "../../types/modal";

const success = /-(?:ok|yes)$/;
const failure = /-(?:cancel|no)$/;
const keepModal = /^modal(?:-buttons)?$/;
const sound = new Audio("/modal.mp3");

export default function Modal({ modal, setModal, timeOut = 3000 }: ModalProps) {
  useEffect(() => {
    const id = setTimeout(() => {
      setModal(undefined);
    }, timeOut);

    return () => clearTimeout(id);
  }, [modal]);

  if (!modal) return;

  const { prompt, onSuccess, onFailure, lang = "fi", buttons = "oc" } = modal;

  if (prompt) {
    sound.currentTime = 0;
    sound.play();
  }

  return (
    prompt && (
      <div
        {...{
          id: "modal-blur",
          onClick: (e) => {
            const t = e.target as HTMLElement;

            if (success.test(t.id) && onSuccess) onSuccess();
            else if (failure.test(t.id) && onFailure) onFailure();

            if (!keepModal.test(t.id)) setModal(undefined);
          },
        }}
      >
        <div id="modal" className="padded bordered">
          {prompt}
          <Buttons {...{ buttons, lang }} />
        </div>
      </div>
    )
  );
}
