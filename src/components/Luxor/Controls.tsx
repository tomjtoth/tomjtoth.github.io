import useLuxor from "../../hooks/luxor";
import useField from "../../hooks/useField";
import { NumberInputProps } from "../../types/hooks";

export default function Controls() {
  const { locked, toggleLocked, pickedNums, addNum, clearNums } = useLuxor();

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
        if (!pickedNums.includes(value as number)) addNum(value as number);

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
        onClick={clearNums}
        title="jelölések törlése"
      >
        ♻️
      </span>
    </form>
  );
}
