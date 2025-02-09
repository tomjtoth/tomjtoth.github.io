import { useAppDispatch, useAppSelector } from "../../hooks";
import { NumberInputProps } from "../../types/hooks";
import useField from "../../hooks/useField";
import {
  clearNums,
  saveFields,
  toggleLock,
  addNum,
} from "../../reducers/luxor";
import { useContext } from "react";
import { CxModal } from "../Modal";
import { Language, Text } from "../../types/modal";

const numOnly = /^\d+$/;

export default function ControlForm() {
  const { setModal } = useContext(CxModal)!;
  const dispatch = useAppDispatch();
  const { locked, pickedNums } = useAppSelector((s) => s.luxor);
  const { reset: resetInput, ...num } = useField("number", {
    id: "luxor-adder",
    placeholder: "a következő nyerőszám",
    max: 75,
    min: 0,
    className: "bordered",
    autoComplete: "off",
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      id="luxor-control"
      onSubmit={(e) => {
        const { value } = num as NumberInputProps;
        if (
          numOnly.test(value.toString()) &&
          !(pickedNums as number[]).includes(value as number)
        )
          dispatch(addNum(value as number));

        resetInput();
        e.preventDefault();
      }}
    >
      <span
        className="padded clickable"
        onClick={() => {
          if (!locked) dispatch(saveFields());

          dispatch(toggleLock());
        }}
      >
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
