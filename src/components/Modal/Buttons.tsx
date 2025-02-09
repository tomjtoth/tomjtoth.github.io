import { useContext } from "react";
import { CxModal } from ".";
import { Language, Text } from "../../types/modal";

const TEXTS = Object.fromEntries(
  [
    [Text.Ok, { [Language.Fi]: "Okei", [Language.Hu]: "Oké" }],
    [Text.Cancel, { [Language.Fi]: "Peruuta", [Language.Hu]: "Mégse" }],
    [Text.Yes, { [Language.Fi]: "Kyllä", [Language.Hu]: "Igen" }],
    [Text.No, { [Language.Fi]: "Ei", [Language.Hu]: "Nem" }],
  ].map(([en, rest]: any) => [en, { ...rest, en: Text[en] }])
);

export default function Buttons() {
  const { modal } = useContext(CxModal)!;
  const { lang, buttons } = modal!;

  let autoFocusUnset = true;

  return (
    <div id="modal-buttons">
      {(buttons ?? []).map(([text, onClick], key) => {
        let autoFocus;
        if (autoFocusUnset && (text === Text.Ok || text === Text.Yes)) {
          autoFocus = true;
          autoFocusUnset = false;
        }

        return (
          <button
            key={key}
            {...{
              autoFocus,
              className: "clickable",
              onClick,
            }}
          >
            {TEXTS[text][lang ?? Language.Fi]}
          </button>
        );
      })}
    </div>
  );
}
