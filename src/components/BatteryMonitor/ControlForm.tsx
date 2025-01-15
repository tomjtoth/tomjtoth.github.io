import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useBattery } from "react-use";

import { checkPermission } from "./notifications";
import { useField } from "../../hooks";
import { setLevels, setAllowed } from "../../reducers/battery-monitor";
import { BatteryState, ControlFormProps } from "../../types/battery-monitor";

export default function ControlForm({ setModal }: ControlFormProps) {
  const dispatch = useAppDispatch();
  const { min_val, max_val, allowed } = useAppSelector((s) => s.batteryMonitor);
  const { isSupported, loading, charging, level } =
    useBattery() as BatteryState;
  const lvl100 = Math.round(level * 100);

  let className;
  if (min_val > max_val) className = "invalid";

  // eslint-disable-next-line no-unused-vars
  const { reset: resetAllow, ...allow } = useField("checkbox", {
    id: "bat-mon-allowed",
    initially: allowed,
    className: "clickable",
  });

  // eslint-disable-next-line no-unused-vars
  const { reset: _resetMin, ...min } = useField("number", {
    id: "bat-mon-min",
    className,
    initially: min_val,
    max: 50,
    min: 10,
    title: "alaraja",
  });

  // eslint-disable-next-line no-unused-vars
  const { reset: _resetMax, ...max } = useField("number", {
    id: "bat-mon-max",
    className,
    initially: max_val,
    max: 90,
    min: 50,
    title: "yläraja",
  });

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        setLevels({
          min_val: min.value as number,
          max_val: max.value as number,
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
                Math.abs(max_val - lvl100) < Math.abs(min_val - lvl100)
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
