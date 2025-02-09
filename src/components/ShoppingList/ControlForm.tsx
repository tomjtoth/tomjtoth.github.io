import { useAppDispatch } from "../../hooks";
import useField from "../../hooks/useField";
import { NumberInputProps } from "../../types/hooks";
import { ControlFormProps } from "../../types/shopping-list";
import {
  addItem,
  resetActiveItems,
  toggleActive,
} from "../../reducers/shopping-list";
import { CxModal } from "../Modal";
import { useContext } from "react";
import { Text } from "../../types/modal";

const RE_EMPTY_STRING = /^\s*$/;

export default function ControlForm({ active }: ControlFormProps) {
  const { setModal } = useContext(CxModal)!;
  const dispatch = useAppDispatch();
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
        const { value } = item as NumberInputProps;
        if (!RE_EMPTY_STRING.test(value.toString()))
          dispatch(addItem(value.toString()));
        resetItem();
        e.preventDefault();
      }}
      onClick={({ target }) => {
        const { id } = target as HTMLElement;
        if (id === "slr-toggler") {
          dispatch(toggleActive("slr"));
        } else if (id === "sli-reset") {
          setModal({
            prompt: "pyyhitäänkö kaikki vihreät?",
            buttons: [
              [Text.Yes, () => dispatch(resetActiveItems())],
              [Text.No],
            ],
          });
        }
      }}
    >
      <span id="slr-toggler" className="clickable" title={title}>
        {emoji}
      </span>
      <input {...item} />
      <span id="sli-reset" className="clickable" title="pyyhi vihreät">
        ♻️
      </span>
    </form>
  );
}
