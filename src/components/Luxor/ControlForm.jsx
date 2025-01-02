import { useDispatch, useSelector } from "react-redux";
import { useField } from "../../hooks";
import { resetSelected, toggleEditMode } from "../../reducers/luxor";

export default function () {
  const dispatch = useDispatch();
  const { locked } = useSelector((s) => s.luxor);
  const { reset: resetInput, ...num } = useField("text", {
    placeholder: "a következő nyerőszám",
    id: "luxor-adder",
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      id="luxor-control"
      onSubmit={(e) => {
        if (!re.emptyString.test(num.value)) dispatch(addItem(num.value));
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
        onClick={() => dispatch(toggleEditMode())}
      >
        {locked ? "🔓" : "🔒"}
      </span>
      <input
        {...num}
        className="padded bordered"
        style={{ margin: 16, flexGrow: 1 }}
      />
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
