import { useEffect } from "react";

import "./modal.css";

import Buttons from "./Buttons";

const success = /-(?:ok|yes)$/;
const keepModal = /^modal(?:-buttons)?$/;

export default function ({ modal, setModal, timeOut = 30000 }) {
  const { prompt, onSuccess, lang = "fi", buttons = "oc" } = modal;

  useEffect(() => {
    const id = setTimeout(() => {
      setModal({});
    }, timeOut);

    return () => clearTimeout(id);
  }, [modal]);

  return (
    prompt && (
      <div
        {...{
          id: "modal-blur",
          onClick: (e) => {
            if (success.test(e.target.id)) onSuccess();

            if (!keepModal.test(e.target.id)) setModal({});
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
