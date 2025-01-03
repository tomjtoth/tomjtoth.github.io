import { useDispatch, useSelector } from "react-redux";
import { useField } from "../../hooks";
import {
  resetSelected,
  saveFields,
  toggleEditMode,
  newNumber,
} from "../../reducers/luxor";

const numOnly = /^\d+$/;

export default function () {
  const dispatch = useDispatch();
  const { locked, fields } = useSelector((s) => s.luxor);
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
      onClick={({ target: { id } }) => {
        if (id === "recipes-toggler") {
          dispatch(toggleActive("recipes"));
        } else if (id === "reset-items") {
          // TODO: implement modal confirm
          dispatch(resetSelected());
        }
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
      <input {...num} className="bordered padded" />
      <span
        className="padded clickable"
        onClick={() => dispatch(resetSelected())}
        title="jelölések törlése"
      >
        ♻️
      </span>
    </form>
  );
}
