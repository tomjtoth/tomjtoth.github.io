import { useEffect } from "react";

import { between } from "../../utils";
import {
  useAppDispatch,
  useAppSelector,
  useField,
  useNotify,
} from "../../hooks";
import { bm } from "../../reducers";

export default function Controls() {
  const dispatch = useAppDispatch();
  const notify = useNotify();

  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);
  const state = useAppSelector((s) => s.batteryMonitor.state);
  const conf = useAppSelector((s) => s.batteryMonitor.conf);

  const { upper, lower, allowed } = conf!;

  const disabled = isSupported ? undefined : true;

  const { reset: resetAllow, ...allow } = useField("checkbox", {
    id: "bat-mon-allowed",
    initially: allowed,
    className: "mr-2 clickable",
    disabled,
  });

  const { reset: _resetMin, ...min } = useField("number", {
    id: "bat-mon-lower",
    initially: lower,
    max: 50,
    min: 10,
    title: "alaraja: 10-50",
    disabled,
    className: "w-8",
  });

  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-upper",
    initially: upper,
    max: 90,
    min: 50,
    title: "yläraja: 50-90",
    disabled,
    className: "w-8",
  });

  useEffect(() => {
    const minNum = Number(min.value);
    const maxNum = Number(max.value);

    if (
      !isNaN(minNum) &&
      !isNaN(maxNum) &&
      between(minNum, 10, 50) &&
      between(maxNum, 50, 90) &&
      (minNum != lower || maxNum != upper)
    ) {
      const id = setTimeout(() => dispatch(bm.setLevels(minNum, maxNum)), 100);

      return () => clearTimeout(id);
    }
  }, [min.value, max.value]);

  useEffect(() => {
    const proceed = () => dispatch(bm.setAllowed(allow.checked!));
    if (allow.checked !== allowed) {
      if (allow.checked) {
        notify("Akunvalvonta", "näyteilmoitus").then(proceed).catch(resetAllow);
      } else proceed();
    }
  }, [allow.checked]);

  let hud = null;

  if (!state) {
    hud = "🤔";
  } else if (state) {
    hud = (
      <>
        {state.charging
          ? "⚡"
          : // lvl100 is closer to max_val, than min_val
          Math.abs(upper - state.level) < Math.abs(lower - state.level)
          ? "🔋"
          : "🪫"}
        {state.level}%
      </>
    );
  }

  return (
    <div>
      <label htmlFor="bat-mon-allowed" className="clickable">
        sallittu:
      </label>
      <input {...allow} />
      <input {...min} />
      <strong className="border rounded p-2 mx-2">{hud}</strong>
      <input {...max} />
    </div>
  );
}
