import { useContext } from "react";

import { CxViewContent } from "..";
import {
  useAppDispatch,
  useAppSelector,
  useField,
  useModal,
} from "../../hooks";
import { TextInputProps } from "../../types/hooks";
import { tSL } from "../../reducers";

export default function Controls() {
  const dispatch = useAppDispatch();
  const modal = useModal();
  const active = useAppSelector((s) => s.shoppingList.active);
  const vcRef = useContext(CxViewContent);

  const { reset: resetItem, ...item } = useField("text");

  const slrIsActive = active.includes("slr");

  const [title, emoji] = slrIsActive
    ? ["sulje reseptit", "📖"]
    : ["avaa reseptit", "📕"];

  return (
    <form
      className="w-full flex items-center gap-2 my-2"
      onSubmit={(e) => {
        const { value } = item as TextInputProps;
        const trimmed = value.trim();

        if (trimmed.length > 0) {
          dispatch(tSL.addItem(trimmed));
          resetItem();
        }
        e.preventDefault();
      }}
    >
      <span
        className="clickable mx-2 p-2 shrink-0 whitespace-nowrap"
        title={title}
        onClick={() => {
          dispatch(tSL.toggle("slr"));
          if (!slrIsActive)
            vcRef?.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
        }}
      >
        {emoji}
      </span>
      <input
        {...item}
        placeholder="lisää tavara tänne"
        className="placeholder:text-center grow max-w-full min-w-0 w-7 p-2 border rounded"
      />
      <span
        className="clickable mx-2 p-2 shrink-0 whitespace-nowrap"
        title="pyyhi vihreät"
        onClick={() =>
          modal
            .yes(() => dispatch(tSL.reset()))
            .no()
            .prompt("pyyhitäänkö kaikki vihreät?")
        }
      >
        ♻️
      </span>
    </form>
  );
}
