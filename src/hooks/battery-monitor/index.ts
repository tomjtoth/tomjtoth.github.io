import { createContext, useContext, useEffect, useState } from "react";

import {
  notify,
  notiText,
} from "../../components/BatteryMonitor/notifications";
import { Conf, TCxBatMon } from "../../types/battery-monitor";
import useBatteryManager from "./battery-manager";
import db from "../../services/battery-monitor";
import { CxModal } from "../modal";

export const CxBatMon = createContext<TCxBatMon | undefined>(undefined);

export default function useBatteryMonitor() {
  const modal = useContext(CxModal)!;
  const bat = useBatteryManager();
  const [conf, setConf] = useState<Conf | undefined>(undefined);

  useEffect(() => {
    if (conf) {
      const { lower, upper, allowed } = conf;
      // if (allowed && bat.state && bat.state.present) {
      if (allowed && bat.state) {
        const { charging, level } = bat.state;

        function check() {
          if ((charging && level >= upper) || (!charging && level <= lower)) {
            notify(notiText(charging, level));
          }
          console.debug("conf", conf, "bat.state", bat.state);
        }

        check();
        const id = setInterval(check, 60_000);
        return () => clearInterval(id);
      }
    } else {
      db.load().then((loaded) => setConf(loaded));
    }
  }, [conf, bat]);

  return {
    modal,
    ...bat,
    conf,
    setAllowed: (to) => {
      if (conf) {
        const next = { ...conf, allowed: to };
        setConf(next);
        db.save(next);
      }
    },
    setLevels: (lower, upper) => {
      if (conf) {
        const next = { ...conf, lower, upper };
        setConf(next);
        db.save(next);
      }
    },
  } as TCxBatMon;
}
