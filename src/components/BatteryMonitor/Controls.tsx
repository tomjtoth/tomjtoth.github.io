import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useBattery } from "react-use";

import useField from "../../hooks/useField";
import { checkPermission } from "./notifications";
import { setLevels, setAllowed } from "../../reducers/battery-monitor";
import { BatteryState } from "../../types/battery-monitor";
import { CxModal } from "../Modal";

export default function Controls() {
  const { setModal } = useContext(CxModal)!;
  const dispatch = useAppDispatch();
  const { lower, upper, allowed } = useAppSelector((s) => s.batteryMonitor);
  const { isSupported, loading, charging, level } =
    useBattery() as BatteryState;
  const lvl100 = Math.round(level * 100);

  let className;
  if (lower > upper) className = "invalid";

  const { reset: resetAllow, ...allow } = useField("checkbox", {
    id: "bat-mon-allowed",
    initially: allowed,
    className: "clickable",
  });

  const { reset: _resetMin, ...min } = useField("number", {
    id: "bat-mon-min",
    className,
    initially: lower,
    max: 50,
    min: 10,
    title: "alaraja",
  });

  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-max",
    className,
    initially: upper,
    max: 90,
    min: 50,
    title: "yläraja",
  });

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        setLevels({
          lower: min.value as number,
          upper: max.value as number,
        })
      );
    }, 300);

    return () => clearTimeout(id);
  }, [min.value, max.value]);

  useEffect(() => {
    const dp = () => dispatch(setAllowed(allow.checked));

    if (allow.checked) {
      checkPermission(setModal).then((notiAllowed) => {
        if (notiAllowed) dp();
        else resetAllow();
      });
    } else dp();
  }, [allow.checked]);

  return (
    isSupported && (
      <>
        <label htmlFor="bat-mon-allowed" className="clickable">
          sallittu:
        </label>
        <input {...allow} />
        {/* <label htmlFor="bat-mon-min">🪫</label> */}
        <input {...min} />
        {!loading && (
          <>
            <strong id="bat-mon-hud" className="bordered">
              {charging
                ? "⚡"
                : // lvl100 is closer to max_val, than min_val
                Math.abs(upper - lvl100) < Math.abs(lower - lvl100)
                ? "🔋"
                : "🪫"}
              {lvl100}%
            </strong>
          </>
        )}
        <input {...max} />
        {/* <label htmlFor="bat-mon-max">🔋</label> */}
      </>
    )
  );
}
