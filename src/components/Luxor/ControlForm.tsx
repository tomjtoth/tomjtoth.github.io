import { useAppDispatch, useAppSelector, useField } from "../../hooks";
import { NumberInputProps } from "../../hooks/types";
import {
  resetSelected,
  saveFields,
  toggleEditMode,
  newNumber,
} from "../../reducers/luxor";
import { ControlFormProps } from "../../types/luxor";

const numOnly = /^\d+$/;

export default function ControlForm({ setModal }: ControlFormProps) {
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
          dispatch(newNumber(value as number));

        resetInput();
        e.preventDefault();
      }}
    >
      <span
        className="padded clickable"
        onClick={() => {
          if (!locked) dispatch(saveFields());

          dispatch(toggleEditMode());
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
            lang: "hu",
            onSuccess: () => dispatch(resetSelected()),
          })
        }
        title="jelölések törlése"
      >
        ♻️
      </span>
    </form>
  );
}
