import { BatteryState as RUBS } from "react-use/lib/useBattery";

export type Levels = {
  lower: number;
  upper: number;
};

export type State = Levels & {
  allowed: boolean;
};

export type BatteryState = RUBS & {
  isSupported: boolean;
  loading: boolean;
};
