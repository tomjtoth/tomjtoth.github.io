import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from ".";
import { BatState, BatteryManager as BatMan } from "../types/battery-monitor";
import { tBM } from "../reducers";

export function useBatteryManager(navi: any) {
  const dispatch = useAppDispatch();
  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);

  const [buffer, setBuffer] = useState<BatState | undefined>(undefined);

  // TODO: is this necessary now that the useselectors have been revised?
  // debounce too frequent changes by 50ms delay
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(tBM.setState(buffer!));
    }, 50);

    return () => clearTimeout(id);
  }, [buffer]);

  // retrieve BatteryManager and attach callbacks for change events
  useEffect(() => {
    if (isSupported && "getBattery" in navi) {
      navi.getBattery().then((battery: BatMan) => {
        function updateBuffer() {
          setBuffer({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            // present:
            //   battery.chargingTime !== Infinity &&
            //   battery.dischargingTime !== Infinity,
          });
        }

        updateBuffer();
        battery.addEventListener("levelchange", updateBuffer);
        battery.addEventListener("chargingchange", updateBuffer);
        // battery.addEventListener("chargingtimechange", updateBuffer);
        // battery.addEventListener("dischargingtimechange", updateBuffer);
      });
    }
  }, []);
}
