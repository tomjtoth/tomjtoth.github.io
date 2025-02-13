import { useEffect } from "react";
import useSpinner from "../../hooks/spinner";
import { useAppSelector } from "..";

export default function useInit() {
  const spinner = useSpinner();
  const loading = useAppSelector((s) => {
    const { isSupported, state, conf } = s.batteryMonitor;
    return isSupported && (!state || !conf);
  });

  useEffect(() => {
    console.debug("battery-monitor/init thinks loading:", loading);

    // init is done by the daemon
    if (loading) {
      spinner.show();
    } else if (spinner.active) {
      spinner.hide();
    }
  }, [loading]);
}
