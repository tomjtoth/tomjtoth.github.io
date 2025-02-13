import { useAppDispatch, useAppSelector } from "..";
import { setBatAllowed, setBatLevels } from "../../reducers/battery-monitor";
import { UseBatMon } from "../../types/battery-monitor";

export default function useBatMon() {
  const dispatch = useAppDispatch();
  const rs = useAppSelector((s) => s.batteryMonitor);

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
