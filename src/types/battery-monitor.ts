import { setModalType } from "./modal";
import { BatteryState as RUBS } from "react-use/lib/useBattery";

export type State = {
  allowed: boolean;
  min_val: number;
  max_val: number;
};

export type ControlFormProps = {
  setModal: setModalType;
};

export type BatteryState = RUBS & {
  isSupported: boolean;
  loading: boolean;
};
