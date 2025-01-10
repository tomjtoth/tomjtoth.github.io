import { setModalType } from "../Modal/types";
import { BatteryState as RUBS } from "react-use/lib/useBattery";

export type ControlFormProps = {
  setModal: setModalType;
};

export type BatteryState = RUBS & {
  isSupported: boolean;
  loading: boolean;
};
