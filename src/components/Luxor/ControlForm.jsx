import { useDispatch, useSelector } from "react-redux";
import { useField } from "../../hooks";
import {
  resetSelected,
  undo,
  saveFields,
  toggleEditMode,
  newNumber,
} from "../../reducers/luxor";

const numOnly = /^\d+$/;

export default function ({ setModal }) {
  const dispatch = useDispatch();
  const { locked, pickedNums } = useSelector((s) => s.luxor);
  const { reset: resetInput, ...num } = useField("number", {
    id: "luxor-adder",
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      id="luxor-control"
      onSubmit={(e) => {
        if (numOnly.test(num.value)) dispatch(newNumber(num.value));
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
      {pickedNums.length > 0 && (
        <span
          className="padded clickable"
          onClick={() =>
            setModal({
              prompt: (
                <>
                  Törlöm az <strong>utolsó</strong> húzott számot
                </>
              ),
              lang: "hu",
              onSuccess: () => dispatch(undo()),
            })
          }
        >
          ⎌
        </span>
      )}
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
