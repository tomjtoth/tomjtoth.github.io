import { useEffect, useState } from "react";

import { Text, Language, ModalType, ModalBuilder } from "../../types/modal";

const SOUND = new Audio("/modal.mp3");
const DEFAULT: ModalType = {
  buttons: [],
};

export default function useBuilder() {
  const [modal, setModal] = useState<ModalType>(DEFAULT);

  const { silent, removeAfter } = modal;

  if (silent !== undefined && silent !== true) {
    console.debug("playing modal sound");
    SOUND.currentTime = 0;
    SOUND.play();
  }

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

    reset: () => setModal(DEFAULT),
  } as ModalBuilder;

  useEffect(() => {
    if (removeAfter !== undefined) {
      const id = setTimeout(() => {
        setModal(DEFAULT);
      }, removeAfter);

      return () => clearTimeout(id);
    }
  }, [removeAfter]);

  return builder;
}
