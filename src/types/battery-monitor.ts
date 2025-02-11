import { ModalBuilder } from "./modal";

export type BatteryState = {
  level: number;
  charging: boolean;
  // present: boolean;
};

export type Conf = {
  lower: number;
  upper: number;
  allowed: boolean;
};

export type TCxBatMon = {
  modal: ModalBuilder;
  isSupported: boolean;
  state?: BatteryState;
  conf?: Conf;
  setAllowed: (to: boolean) => void;
  setLevels: (lower: number, upper: number) => void;
};
