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
      <div className="m-4 mb-2 flex justify-evenly gap-8">
        {buttons.map(({ text, onClick }, key) => {
          let autoFocus;
          let label;

          if (typeof text === "string") {
            label = text;
          } else {
            label =
              TEXTS[text][
                lang && Object.values(Language).includes(lang as Language)
                  ? lang
                  : Language.Fi
              ];

            if (autoFocusUnset && (text === Text.Ok || text === Text.Yes)) {
              autoFocus = true;
              autoFocusUnset = false;
            }
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
              {label}
            </button>
          );
        })}
      </div>
    )
  );
}
