import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBattery } from "react-use";

import { checkPermission } from "./notifications";
import { useField } from "../../hooks";
import { saveLevels, toggleActive } from "../../reducers/battery-monitor";

export default function ControlForm({ setModal }) {
  const dispatch = useDispatch();
  const { min_val, max_val, allowed } = useSelector((s) => s.batteryMonitor);
  const { isSupported, loading, charging, level } = useBattery();
  const lvl100 = Math.round(level * 100);

  let className;
  if (min_val > max_val) className = "invalid";

  // eslint-disable-next-line no-unused-vars
  const { reset: _resetBg, ...allow } = useField("checkbox", {
    id: "bat-mon-allowed",
    initially: allowed,
  });

  // eslint-disable-next-line no-unused-vars
  const { reset: _resetMin, ...min } = useField("number", {
    id: "bat-mon-min",
    className,
    initially: min_val,
    max: 50,
    min: 10,
  });

  // eslint-disable-next-line no-unused-vars
  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-max",
    className,
    initially: max_val,
    max: 90,
    min: 50,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        saveLevels({
          min_val: min.value,
          max_val: max.value,
        })
      );
    }, 300);

    return () => clearTimeout(id);
  }, [min.value, max.value]);

  useEffect(() => {
    const dp = () => dispatch(toggleActive(allow.checked));

    if (allow.checked) {
      checkPermission(setModal).then((notiAllowed) => {
        if (notiAllowed) dp();
      });
    } else dp();
  }, [allow.checked]);

  return (
    isSupported && (
      <>
        <label htmlFor="bat-mon-allowed">sallittu:</label>
        <input {...allow} />
        <label htmlFor="bat-mon-min">min 👉</label>
        <input {...min} />
        {!loading && (
          <>
            <strong id="bat-mon-hud" className="bordered">
              {charging
                ? "⚡"
                : // lvl100 is closer to max_val, than min_val
                Math.abs(max_val - lvl100) < Math.abs(min_val - lvl100)
                ? "🔋"
                : "🪫"}
              {lvl100}%
            </strong>
          </>
        )}
        <input {...max} />
        <label htmlFor="bat-mon-max">👈 max</label>
      </>
    )
  );
}
