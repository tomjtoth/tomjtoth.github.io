import { useDispatch, useSelector } from "react-redux";
import { useField } from "../../hooks";
import {
  resetSelected,
  saveFields,
  toggleEditMode,
  newNumber,
} from "../../reducers/luxor";

const numOnly = /^\d+$/;

export default function ControlForm({ setModal }) {
  const dispatch = useDispatch();
  const { locked, pickedNums } = useSelector((s) => s.luxor);
  const { reset: resetInput, ...num } = useField("number", {
    id: "luxor-adder",
    placeholder: "a következő nyerőszám",
    max: 75,
    min: 0,
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      id="luxor-control"
      onSubmit={(e) => {
        if (numOnly.test(num.value) && !pickedNums.includes(num.value))
          dispatch(newNumber(num.value));

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
      <input {...num} className="bordered" />
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
