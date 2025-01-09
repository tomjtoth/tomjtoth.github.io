import { useEffect } from "react";
import { useAppSelector } from ".";
import { useBattery } from "react-use";

import { notify } from "../components/BatteryMonitor/notifications";

const SEC = 1000;

export default function () {
  const { min_val, max_val, allowed } = useAppSelector((s) => s.batteryMonitor);

  const { isSupported, level, charging, chargingTime, dischargingTime } =
    useBattery();
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
          notify(
            `Akun taso on nyt ${lvl100}% ${
              charging ? "ja laturi on kiinni" : "eikä laturi oo kytkettynä"
            }`
          );
        }
      }, 30 * SEC);

      return () => clearInterval(id);
    }
  }, [allowed, level, charging, min_val, max_val]);
}
