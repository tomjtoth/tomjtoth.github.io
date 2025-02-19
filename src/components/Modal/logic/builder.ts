import { useState } from "react";

import { Text, Language, ModalType, ModalBuilder } from "../../../types/modal";

const DEFAULT: ModalType = {
  buttons: [],
  silent: false,
};

export default function useBuilder() {
  const [modal, setModal] = useState<ModalType>(DEFAULT);

  console.debug("useModalBuilder");

  // TODO: handle the default 3 language and 4 button via Proxy
  const builder = {
    _buffer: DEFAULT,

    lang: function (lang) {
      this._buffer = { ...this._buffer, lang };
      return this;
    },

    en: function () {
      return this.lang(Language.En);
    },

    // fi: function () {
    //   return this.lang(Language.Fi);
    // },

    hu: function () {
      return this.lang(Language.Hu);
    },

    ok: function (onClick?) {
      return this.button(Text.Ok, onClick);
    },

    cancel: function (onClick?) {
      return this.button(Text.Cancel, onClick);
    },

    yes: function (onClick?) {
      return this.button(Text.Yes, onClick);
    },

    no: function (onClick?) {
      return this.button(Text.No, onClick);
    },

    button: function (text, onClick?) {
      this._buffer = {
        ...this._buffer,
        buttons: [...this._buffer.buttons, { text, onClick }],
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

  // const proxy = new Proxy(builder, {
  //   get(target, prop, receiver) {
  //     if (prop in ["ok", "cancel", "yes", "no"]) {
  //       return 1;
  //     }
  //   },
  // });

  return {
    modal,
    builder,
    reset: () => {
      console.debug("resetting modal");
      setModal(DEFAULT);
    },
  };
}
