import { useContext, useEffect } from "react";

import useField from "../../hooks/useField";
import { checkPermission } from "./notifications";
import { CxModal } from "../../hooks/modal";
import useBatMon from "../../hooks/battery-monitor";

export default function Controls() {
  const modal = useContext(CxModal)!;

  const { isSupported, conf, state, setLevels, setAllowed } = useBatMon();
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
    title: "alaraja",
    disabled,
    style,
  });

  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-upper",
    initially: upper,
    max: 90,
    min: 50,
    title: "yläraja",
    disabled,
    style,
  });

  useEffect(() => {
    const id = setTimeout(
      () => setLevels(min.value as number, max.value as number),
      100
    );

    return () => clearTimeout(id);
  }, [min.value, max.value]);

  useEffect(() => {
    const dp = () => {
      if (allow.checked === true || allow.checked === false)
        setAllowed(allow.checked);
    };

    if (allow.checked) {
      checkPermission(modal).then((notiAllowed) => {
        if (notiAllowed) dp();
        else resetAllow();
      });
    } else dp();
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
