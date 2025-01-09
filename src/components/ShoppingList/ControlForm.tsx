import { useField, useAppDispatch } from "../../hooks";
import {
  addItem,
  resetSelected,
  toggleActiveId,
} from "../../reducers/shopping-list";
import { re } from "./config";
import { ControlFormProps } from "./types";

export default function ControlForm({ active, setModal }: ControlFormProps) {
  const dispatch = useAppDispatch();
  const { reset: resetItem, ...item } = useField("text", {
    placeholder: "lisää tavara tänne",
    id: "recipe-item-adder",
  });

  const [title, emoji] = active.includes("recipes")
    ? ["sulje reseptit", "📖"]
    : ["avaa reseptit", "📕"];

  return (
    <form
      id="recipe-control"
      onSubmit={(e) => {
        if (!re.emptyString.test(item.value)) dispatch(addItem(item.value));
        resetItem();
        e.preventDefault();
      }}
      onClick={({ target }) => {
        const { id } = target as HTMLElement;
        if (id === "recipes-toggler") {
          dispatch(toggleActiveId("recipes"));
        } else if (id === "reset-items") {
          setModal({
            prompt: "pyyhitäänkö kaikki vihreät?",
            onSuccess: () => dispatch(resetSelected()),
          });
        }
      }}
    >
      <span id="recipes-toggler" className="clickable" title={title}>
        {emoji}
      </span>
      <input {...item} />
      <span id="reset-items" className="clickable" title="pyyhi vihreät">
        ♻️
      </span>
    </form>
  );
}
