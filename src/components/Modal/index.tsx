import { createContext, PropsWithChildren, useEffect, useState } from "react";

import "./modal.css";

import { Text, Language, ModalType, ModalBuilder } from "../../types/modal";
import Buttons from "./Buttons";

const SOUND = new Audio("/modal.mp3");
const DEFAULT: ModalType = {
  buttons: [],
};

export const CxModal = createContext<ModalBuilder | undefined>(undefined);

export default function Modal({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<ModalType>(DEFAULT);

  const { prompt, lang, silent, removeAfter } = modal;

  // TODO: handle the default 3 language and 4 button via Proxy
  const builder = {
    _buffer: DEFAULT,
    modal,

    en: function () {
      this._buffer = { ...this._buffer, lang: Language.En };
      return this;
    },

    fi: function () {
      this._buffer = { ...this._buffer, lang: Language.Fi };
      return this;
    },

    hu: function () {
      this._buffer = { ...this._buffer, lang: Language.Hu };
      return this;
    },

    // lang: function (lang: string) {
    //   setBuffer({ ...buffer, lang });
    //   return this;
    // },

    ok: function (onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, [Text.Ok, onClick]],
      };

      return this;
    },

    cancel: function (onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, [Text.Cancel, onClick]],
      };
      return this;
    },

    yes: function (onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, [Text.Yes, onClick]],
      };
      return this;
    },

    no: function (onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, [Text.No, onClick]],
      };
      return this;
    },

    button: function (text, onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, [text, onClick]],
      };
      return this;
    },

    silent: function () {
      this._buffer = { ...this._buffer, silent: true };
      return this;
    },

    removeAfter: function (ms) {
      this._buffer = { ...this._buffer, removeAfter: ms };
      return this;
    },

    prompt: function (prompt) {
      setModal({ ...this._buffer, prompt });
      this._buffer = DEFAULT;
    },
  } as ModalBuilder;

  useEffect(() => {
    if (removeAfter !== undefined) {
      const id = setTimeout(() => {
        setModal(DEFAULT);
      }, removeAfter);

      return () => clearTimeout(id);
    }
  }, [removeAfter]);

  let modalDiv;

  if (prompt) {
    modalDiv = (
      <div
        {...{
          className: "modal-blur",
          onClick: () => setModal(DEFAULT),
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
          <Buttons />
        </div>
      </div>
    );

    if (!silent) {
      console.debug("playing modal sound");
      SOUND.currentTime = 0;
      SOUND.play();
    }
  }

  return (
    <CxModal.Provider value={builder}>
      {modalDiv}
      {children}
    </CxModal.Provider>
  );
}
