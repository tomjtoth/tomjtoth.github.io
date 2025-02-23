import {
  useAppDispatch,
  useAppSelector,
  useField,
  useModal,
} from "../../hooks";
import { TextInputProps } from "../../types/hooks";
import {
  addItemSL,
  resetActiveSL,
  toggleActiveSL,
} from "../../reducers/shopping-list";

export default function Controls() {
  const dispatch = useAppDispatch();
  const modal = useModal();
  const active = useAppSelector((s) => s.shoppingList.active);

  const { reset: resetItem, ...item } = useField("text");

  const [title, emoji] = active.includes("slr")
    ? ["sulje reseptit", "📖"]
    : ["avaa reseptit", "📕"];

  return (
    <form
      className="w-full flex items-center gap-2 py-2"
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
        className="clickable mx-4 shrink-0 whitespace-nowrap"
        title={title}
        onClick={() => dispatch(toggleActiveSL("slr"))}
      >
        {emoji}
      </span>
      <input
        {...item}
        placeholder="lisää tavara tänne"
        className="placeholder:text-center grow max-w-full min-w-0 w-7 p-2 border rounded"
      />
      <span
        className="clickable mx-4 shrink-0 whitespace-nowrap"
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
