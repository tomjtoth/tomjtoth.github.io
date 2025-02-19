import { useAppDispatch, useAppSelector } from "../../hooks";
import { NumberInputProps } from "../../types/hooks";
import useField from "../../hooks/useField";
import useModal from "../../hooks/modal";
import {
  luxorAddNum,
  luxorClearNums,
  luxorToggleLocked,
} from "../../reducers/luxor";

export default function Controls() {
  const dispatch = useAppDispatch();
  const modal = useModal();
  const locked = useAppSelector((s) => s.luxor.locked);
  const pickedNums = useAppSelector((s) => s.luxor.pickedNums);

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
        if (!pickedNums.includes(value as number))
          dispatch(luxorAddNum(value as number));

        resetInput();
        e.preventDefault();
      }}
    >
      <span
        className="padded clickable"
        onClick={() => dispatch(luxorToggleLocked())}
      >
        {locked ? "🔒" : "🔓"}
      </span>
      <input {...num} />
      <span
        className="padded clickable"
        onClick={() =>
          modal
            .hu()
            .ok(() => dispatch(luxorClearNums()))
            .cancel()
            .prompt(
              <>
                Törlöm az <strong>összes</strong> húzott számot
              </>
            )
        }
        title="jelölések törlése"
      >
        ♻️
      </span>
    </form>
  );
}
