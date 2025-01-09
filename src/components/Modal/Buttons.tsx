import { ModalButtonsProps } from "./types";

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

  for (let i = 0; i < buttons.length; i++) {
    const xx = translations[buttons.charAt(i)];

    const id = `modal-${xx.en.toLowerCase()}`;

    res.push(
      <button
        key={id}
        {...{
          id,
          className: "clickable",
        }}
      >
        {xx[lang]}
      </button>
    );
  }

  return <div id="modal-buttons">{res}</div>;
}
