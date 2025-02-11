import { useEffect, useState } from "react";

import { BatteryState } from "../../types/battery-monitor";

const isSupported = "getBattery" in navigator;

export default function useBatteryManager() {
  const [buffer, setBuffer] = useState<BatteryState | undefined>(undefined);
  const [state, setState] = useState(buffer);

  // debounce too frequent changes by 50ms delay
  useEffect(() => {
    const id = setTimeout(() => {
      setState(buffer);
      console.debug("battery status change debounced", buffer);
    }, 50);

    return () => clearTimeout(id);
  }, [buffer]);

  // retrieve BatteryManager and attach callbacks for change events
  useEffect(() => {
    if (isSupported) {
      (navigator as any).getBattery().then((battery: any) => {
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
    } else {
      setBuffer(undefined);
      console.error("Battery API is not supported on this browser.");
    }
  }, []);

  return { isSupported, state };
}
