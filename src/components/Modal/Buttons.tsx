import { Language, ModalButtonsProps, Text } from "../../types/modal";

const TEXTS = Object.fromEntries(
  [
    [Text.Ok, { [Language.Fi]: "Okei", [Language.Hu]: "Oké" }],
    [Text.Cancel, { [Language.Fi]: "Peruuta", [Language.Hu]: "Mégse" }],
    [Text.Yes, { [Language.Fi]: "Kyllä", [Language.Hu]: "Igen" }],
    [Text.No, { [Language.Fi]: "Ei", [Language.Hu]: "Nem" }],
  ].map(([en, rest]: any) => [en, { ...rest, en: Text[en] }])
);

export default function Buttons({ buttons, lang }: ModalButtonsProps) {
  let autoFocusUnset = true;

  return (
    buttons &&
    buttons.length > 0 && (
      <div id="modal-buttons">
        {buttons.map(([text, onClick], key) => {
          let autoFocus;

          // TODO: impl supporting custom text
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
    )
  );
}
