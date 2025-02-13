import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import useSpinner from "../../hooks/spinner";
import { setBatAllowed, setBatLevels } from "../../reducers/battery-monitor";
import { UseBatMon } from "../../types/battery-monitor";

export default function useBatMon() {
  const dispatch = useAppDispatch();
  const rs = useAppSelector((s) => s.batteryMonitor);
  const { isSupported, state, conf } = rs;

  const spinner = useSpinner();

  useEffect(() => {
    const loading = isSupported && (!state || !conf);
    console.debug("isLoading:", loading, "reducer state:", rs);

    if (loading) {
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [state, conf]);

  return {
    ...rs,

    setAllowed: (to) => {
      dispatch(setBatAllowed(to));
    },

    setLevels: (lower, upper) => {
      dispatch(setBatLevels({ lower, upper }));
    },
  } as UseBatMon;
}
