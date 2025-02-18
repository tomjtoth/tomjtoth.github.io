import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "..";
import { hideSpinner, showSpinner } from "../../reducers/spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const [loading, spinnerActive] = useAppSelector((s) => {
    const { isSupported, state, conf } = s.batteryMonitor;
    return [isSupported && (!state || !conf), s.spinner.active];
  });

  useEffect(() => {
    console.debug("battery-monitor/init thinks loading:", loading);

    // init is done by the daemon
    if (loading) {
      dispatch(showSpinner());
    } else if (spinnerActive) {
      dispatch(hideSpinner());
    }
  }, [loading]);
}
