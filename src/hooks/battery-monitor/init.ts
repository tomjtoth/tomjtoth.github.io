import { useEffect } from "react";
import useSpinner from "../../hooks/spinner";
import { useAppSelector } from "..";

export default function useInit() {
  const spinner = useSpinner();
  const [loading, spinnerActive] = useAppSelector((s) => {
    const { isSupported, state, conf } = s.batteryMonitor;
    return [isSupported && (!state || !conf), s.spinner.active];
  });

  useEffect(() => {
    console.debug("battery-monitor/init thinks loading:", loading);

    // init is done by the daemon
    if (loading) {
      spinner.show();
    } else if (spinnerActive) {
      spinner.hide();
    }
  }, [loading]);
}
