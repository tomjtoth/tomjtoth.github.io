import { useEffect, useState } from "react";

import { notiText } from "../components/BatteryMonitor";
import { bm } from "../reducers";
import {
  useAppDispatch,
  useAppSelector,
  useNotify,
  useBatteryManager,
} from ".";

const INTERVAL = 60_000;

export function useBatMonDaemon() {
  const notify = useNotify();
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
          notify("Akunvalvonta", notiText(charging, level));
        }
        console.debug("conf", conf, "batState", batState);
        setCheckpoint(Date.now() + INTERVAL);
      }, tillNext());

      return () => clearTimeout(id);
    } else if (!conf) {
      dispatch(bm.init());
    }
  }, [conf, batState, checkpoint]);
}
