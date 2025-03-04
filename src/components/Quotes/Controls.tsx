import { useAppDispatch, useAppSelector } from "../../hooks";
import { tQt } from "../../reducers";
import { between } from "../../utils";

export default function Controls() {
  const dispatch = useAppDispatch();
  const wpm = useAppSelector((s) => s.quotes.wpm);

  return (
    <>
      <label className="hidden sm:contents" htmlFor="wpm">
        lukunopeus:{" "}
      </label>
      <input
        type="number"
        id="wpm"
        value={wpm}
        className="min-w-8 w-10"
        onChange={(ev) => {
          const strVal = ev.target.value;
          if (strVal !== "") {
            const numVal = Number(strVal);
            if (between(numVal, 10, 1000)) dispatch(tQt.setWPM(numVal));
          }
        }}
      />
      wpm
      <span className="grow"></span>
      <span className="clickable px-4" onClick={() => dispatch(tQt.reset())}>
        ♻️
      </span>
    </>
  );
}
