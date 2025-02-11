import { useContext } from "react";

import { CxShopping } from "../../hooks/shopping-list";
import useField from "../../hooks/useField";
import { TextInputProps } from "../../types/hooks";

export default function Controls() {
  const { active, addItem, toggleActive, resetActive } =
    useContext(CxShopping)!;

  const { reset: resetItem, ...item } = useField("text", {
    placeholder: "lisää tavara tänne",
    id: "sli-adder",
  });

  const [title, emoji] = active.includes("slr")
    ? ["sulje reseptit", "📖"]
    : ["avaa reseptit", "📕"];

  return (
    <form
      id="slr-control"
      onSubmit={(e) => {
        const { value } = item as TextInputProps;
        const trimmed = value.trim();

        if (trimmed.length > 0) {
          addItem(trimmed);
          resetItem();
        }
        e.preventDefault();
      }}
    >
      <span
        id="slr-toggler"
        className="clickable"
        title={title}
        onClick={() => toggleActive("slr")}
      >
        {emoji}
      </span>
      <input {...item} />
      <span
        id="sli-reset"
        className="clickable"
        title="pyyhi vihreät"
        onClick={() => resetActive()}
      >
        ♻️
      </span>
    </form>
  );
}
