import { useEffect } from "react";

import {
  notify,
  notiText,
} from "../../components/BatteryMonitor/notifications";
import useBatteryManager from "./manager";
import { initBatMon } from "../../reducers/battery-monitor";

export default function useBatMonDaemon() {
  const { dispatch, isSupported, batState, conf } = useBatteryManager();

  useEffect(() => {
    if (isSupported && conf && conf.allowed && batState) {
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
  }, [conf, batState]);
}
