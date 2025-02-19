import { useEffect } from "react";

import { notify, notiText } from "../components/BatteryMonitor/notifications";
import useBatteryManager from "./battery-manager";
import { initBatMon } from "../reducers/battery-monitor";
import { useAppDispatch, useAppSelector } from ".";

export default function useBatMonDaemon() {
  const dispatch = useAppDispatch();
  useBatteryManager(navigator);

  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);
  const batState = useAppSelector((s) => s.batteryMonitor.state);
  const conf = useAppSelector((s) => s.batteryMonitor.conf);

  const batStateLoaded = batState != undefined;

  useEffect(() => {
    if (isSupported && conf && conf.allowed && batStateLoaded) {
      const { lower, upper } = conf;
      const { charging, level } = batState;

      const id = setInterval(() => {
        if ((charging && level >= upper) || (!charging && level <= lower)) {
          notify(notiText(charging, level));
        }
        console.debug("batMonConf:", conf, "batState:", batState);
      }, 60_000);

      return () => clearInterval(id);
    } else if (!conf) {
      dispatch(initBatMon());
    }
  }, [conf, batStateLoaded]);
}
