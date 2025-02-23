import {
  useAppDispatch,
  useAppSelector,
  useField,
  useModal,
} from "../../hooks";
import { NumberInputProps } from "../../types/hooks";
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
        placeholder: "a következő nyerőszám",
    max: 75,
    min: 0,
        className:
"border rounded grow max-w-full min-w-0 w-6 p-2 placeholder:text-center",
    autoComplete: "off",
  });

  // TODO: refactor styles in shopping-list and this

  return (
    <form
      className="w-full flex items-center gap-2"
      onSubmit={(e) => {
        const { value } = num as NumberInputProps;
        if (!pickedNums.includes(value as number))
          dispatch(luxorAddNum(value as number));

        resetInput();
        e.preventDefault();
      }}
    >
      <span
        className="p-4 clickable"
        onClick={() => dispatch(luxorToggleLocked())}
      >
        {locked ? "🔒" : "🔓"}
      </span>
      <input {...num} />
      <span
        className="p-4 clickable"
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
