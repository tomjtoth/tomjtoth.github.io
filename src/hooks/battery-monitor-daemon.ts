import { useEffect, useState } from "react";

import { notify, notiText } from "../components/BatteryMonitor/notifications";
import useBatteryManager from "./battery-manager";
import { initBatMon } from "../reducers/battery-monitor";
import { useAppDispatch, useAppSelector } from ".";

const INTERVAL = 60_000;

export default function useBatMonDaemon() {
  const dispatch = useAppDispatch();
  useBatteryManager(navigator);

  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);
  const batState = useAppSelector((s) => s.batteryMonitor.state);
  const conf = useAppSelector((s) => s.batteryMonitor.conf);

  const [checkpoint, setCheckpoint] = useState<number>(0);

  function tillNext() {
    const now = Date.now();
    const delay = checkpoint <= now ? INTERVAL : checkpoint - now;
    return delay;
  }

  useEffect(() => {
    if (isSupported && conf && conf.allowed && batState) {
      const id = setTimeout(() => {
        const { lower, upper } = conf;
        const { charging, level } = batState;
        if ((charging && level >= upper) || (!charging && level <= lower)) {
          notify(notiText(charging, level));
        }
        console.debug("conf", conf, "batState", batState);
        setCheckpoint(Date.now() + INTERVAL);
      }, tillNext());

      return () => clearTimeout(id);
    } else if (!conf) {
      dispatch(initBatMon());
    }
  }, [conf, batState, checkpoint]);
}
