import { useEffect } from "react";

import useField from "../../hooks/useField";
import useModal from "../../hooks/modal";
import { checkPermission } from "./notifications";
import { between } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setBatMonAllowed,
  setBatMonLevels,
} from "../../reducers/battery-monitor";

export default function Controls() {
  const dispatch = useAppDispatch();
  const modal = useModal();

  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);
  const state = useAppSelector((s) => s.batteryMonitor.state);
  const conf = useAppSelector((s) => s.batteryMonitor.conf);

  const { upper, lower, allowed } = conf!;

  const style = isSupported ? undefined : { cursor: "not-allowed" };
  const disabled = isSupported ? undefined : true;

  const { reset: resetAllow, ...allow } = useField("checkbox", {
    id: "bat-mon-allowed",
    initially: allowed,
    className: isSupported ? "clickable" : undefined,
    disabled,
    style,
  });

  const { reset: _resetMin, ...min } = useField("number", {
    id: "bat-mon-lower",
    initially: lower,
    max: 50,
    min: 10,
    title: "alaraja: 10-50",
    disabled,
    style,
  });

  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-upper",
    initially: upper,
    max: 90,
    min: 50,
    title: "yläraja: 50-90",
    disabled,
    style,
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
      const id = setTimeout(
        () => dispatch(setBatMonLevels(minNum, maxNum)),
        100
      );

      return () => clearTimeout(id);
    }
  }, [min.value, max.value]);

  useEffect(() => {
    if (allow.checked !== allowed) {
      if (allow.checked) {
        checkPermission(modal).then((notiAllowed) => {
          if (notiAllowed) dispatch(setBatMonAllowed(allow.checked!));
          else resetAllow();
        });
      } else dispatch(setBatMonAllowed(allow.checked!));
    }
  }, [allow.checked]);

  let hud = null;

  if (isSupported && !state) {
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
  } else {
    hud = "🧐";
  }

  return (
    <div>
      <label htmlFor="bat-mon-allowed" className="clickable">
        sallittu:
      </label>
      <input {...allow} />
      {/* <label htmlFor="bat-mon-min">🪫</label> */}
      <input {...min} />
      <strong
        id="bat-mon-hud"
        className="bordered"
        title={state ? undefined : "ei toimi"}
      >
        {hud}
      </strong>
      <input {...max} />
      {/* <label htmlFor="bat-mon-max">🔋</label> */}
    </div>
  );
}
