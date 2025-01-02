import { useDispatch } from "react-redux";
import { useField } from "../../hooks";
import {
  addItem,
  resetSelected,
  toggleActive,
} from "../../reducers/shopping-list";
import { re } from "./config";

export default function ({ active }) {
  const dispatch = useDispatch();
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
      onClick={({ target: { id } }) => {
        if (id === "recipes-toggler") {
          dispatch(toggleActive("recipes"));
        } else if (id === "reset-items") {
          // TODO: implement modal confirm
          dispatch(resetSelected());
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
