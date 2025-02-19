import { useAppDispatch, useAppSelector } from "../../hooks";
import { TextInputProps } from "../../types/hooks";
import useField from "../../hooks/useField";
import useModal from "../../hooks/modal";
import {
  addItemSL,
  resetActiveSL,
  toggleActiveSL,
} from "../../reducers/shopping-list";

export default function Controls() {
  const dispatch = useAppDispatch();
  const modal = useModal();
  const active = useAppSelector((s) => s.shoppingList.active);

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
          dispatch(addItemSL(trimmed));
          resetItem();
        }
        e.preventDefault();
      }}
    >
      <span
        id="slr-toggler"
        className="clickable"
        title={title}
        onClick={() => dispatch(toggleActiveSL("slr"))}
      >
        {emoji}
      </span>
      <input {...item} />
      <span
        id="sli-reset"
        className="clickable"
        title="pyyhi vihreät"
        onClick={() =>
          modal
            .yes(() => dispatch(resetActiveSL()))
            .no()
            .prompt("pyyhitäänkö kaikki vihreät?")
        }
      >
        ♻️
      </span>
    </form>
  );
}
