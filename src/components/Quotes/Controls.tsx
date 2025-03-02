import { useAppDispatch, useAppSelector } from "../../hooks";
import { qts } from "../../reducers";
import { between } from "../../utils";

export default function Controls() {
  const dispatch = useAppDispatch();
  const wpm = useAppSelector((s) => s.quotes.wpm);

  return (
    <>
      <label htmlFor="wpm">lukunopeus: </label>
      <input
        type="number"
        id="wpm"
        value={wpm}
        className="min-w-8 w-10"
        onChange={(ev) => {
          const strVal = ev.target.value;
          if (strVal !== "") {
            const numVal = Number(strVal);
            if (between(numVal, 10, 1000)) dispatch(qts.setWPM(numVal));
          }
        }}
      />
      <span className="clickable" onClick={() => dispatch(qts.reset())}>
        ♻️
      </span>
    </>
  );
}
