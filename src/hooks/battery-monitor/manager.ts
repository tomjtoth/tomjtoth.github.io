import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "..";
import {
  BatState,
  BatteryManager as BatMan,
} from "../../types/battery-monitor";
import { setBatState } from "../../reducers/battery-monitor";

// TODO: pass `bmPromise: Promise<BatteryManager>` for mocking
export default function useBatteryManager(navi: any) {
  const dispatch = useAppDispatch();
  const {
    isSupported,
    state: batState,
    conf,
  } = useAppSelector((s) => s.batteryMonitor);

  const [buffer, setBuffer] = useState<BatState | undefined>(undefined);

  // debounce too frequent changes by 50ms delay
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setBatState(buffer!));
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

  return { dispatch, isSupported, batState, conf };
}
