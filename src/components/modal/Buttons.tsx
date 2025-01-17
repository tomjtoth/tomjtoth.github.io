import { ModalButtonsProps } from "../../types/modal";

const translations = Object.fromEntries(
  Object.entries({
    OK: { hu: "Oké", fi: "Okei" },
    Cancel: { hu: "Mégse", fi: "Peruuta" },
    Yes: { hu: "Igen", fi: "Kyllä" },
    No: { hu: "Nem", fi: "Ei" },
  }).map(([en, xx]) => [en[0].toLowerCase(), { ...xx, en }])
);

export default function Buttons({ lang, buttons }: ModalButtonsProps) {
  const res = [];

  let autoFocusUnset = true;

  for (let i = 0; i < buttons.length; i++) {
    const ch = buttons.charAt(i);
    const xx = translations[ch];

    let autoFocus;
    if (autoFocusUnset && (ch === "o" || ch === "y")) {
      autoFocus = true;
      autoFocusUnset = false;
    }

    const id = `modal-${xx.en.toLowerCase()}`;

    res.push(
      <button
        key={i}
        {...{
          id,
          className: "clickable",
          autoFocus,
        }}
      >
        {xx[lang]}
      </button>
    );
  }

  return <div id="modal-buttons">{res}</div>;
}
