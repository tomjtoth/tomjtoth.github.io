export type BatState = {
  level: number;
  charging: boolean;
  // present: boolean;
};

export type BatMonConf = {
  lower: number;
  upper: number;
  allowed: boolean;
};

export type RedState = {
  isSupported: boolean;
  conf?: BatMonConf;
  state?: BatState;
};

export type UseBatMon = {
  setAllowed: (to: boolean) => void;
  setLevels: (lower: number, upper: number) => void;
};

export type BatteryManager = {
  addEventListener: (event: string, callback: () => void) => void;
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
};
