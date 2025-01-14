import { useEffect } from "react";
import { useAppSelector } from ".";
import { useBattery } from "react-use";

import { notify, notiText } from "../components/BatteryMonitor/notifications";
import { BatteryState } from "../types/battery-monitor";

const SEC = 1000;

export default function () {
  const { min_val, max_val, allowed } = useAppSelector((s) => s.batteryMonitor);

  const { isSupported, level, charging, chargingTime, dischargingTime } =
    useBattery() as BatteryState;

  const lvl100 = Math.round(level * 100);

  useEffect(() => {
    if (
      allowed &&
      isSupported &&
      // battery is present, not removed
      (chargingTime !== Infinity || dischargingTime !== Infinity)
    ) {
      const id = setInterval(() => {
        if (
          (charging && lvl100 >= max_val) ||
          (!charging && lvl100 <= min_val)
        ) {
          notify(notiText(charging, lvl100));
        }
      }, 60 * SEC);

      return () => clearInterval(id);
    }
  }, [allowed, level, charging, min_val, max_val]);
}
