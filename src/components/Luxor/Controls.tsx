import { useAppDispatch, useAppSelector } from "../../hooks";
import { NumberInputProps } from "../../types/hooks";
import useField from "../../hooks/useField";
import { clearNums, addNum } from "../../reducers/luxor";
import { useContext } from "react";
import { CxModal } from "../Modal";
import { Language, Text } from "../../types/modal";
import { CxLuxor } from "./logic";

export default function Controls() {
  const dispatch = useAppDispatch();
  const { pickedNums } = useAppSelector((s) => s.luxor);

  const { setModal } = useContext(CxModal)!;
  const { locked, toggleLocked } = useContext(CxLuxor)!;

  const { reset: resetInput, ...num } = useField("number", {
    id: "luxor-adder",
    placeholder: "a következő nyerőszám",
    max: 75,
    min: 0,
    minLength: 1,
    className: "bordered",
    autoComplete: "off",
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      id="luxor-control"
      onSubmit={(e) => {
        const { value } = num as NumberInputProps;
        if (!(pickedNums as number[]).includes(value as number))
          dispatch(addNum(value as number));

        resetInput();
        e.preventDefault();
      }}
    >
      <span className="padded clickable" onClick={toggleLocked}>
        {locked ? "🔒" : "🔓"}
      </span>
      <input {...num} />
      <span
        className="padded clickable"
        onClick={() =>
          setModal({
            prompt: (
              <>
                Törlöm az <strong>összes</strong> húzott számot
              </>
            ),
            lang: Language.Hu,
            buttons: [[Text.Ok, () => dispatch(clearNums())], [Text.Cancel]],
          })
        }
        title="jelölések törlése"
      >
        ♻️
      </span>
    </form>
  );
}
