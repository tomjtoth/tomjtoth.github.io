import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { BatMonConf, BatState, RedState } from "../types/battery-monitor";
import db from "../services/battery-monitor";

const slice = createSlice({
  name: "battery-monitor",
  initialState: {
    isSupported: "getBattery" in navigator,
  } as RedState,

  reducers: {
    init: (rs, { payload }: PayloadAction<BatMonConf>) => ({
      ...rs,
      conf: payload,
    }),

    setBatState: (rs, { payload }) => {
      console.debug("updating reducer.state", payload);
      rs.state = payload;
    },

    setLevels: (rs, { payload: p }) => {
      rs.conf!.lower = p.lower;
      rs.conf!.upper = p.upper;
      db.save(rs.conf!);
    },

    setAllowed: (rs, { payload }) => {
      rs.conf!.allowed = payload;
      db.save(rs.conf!);
    },
  },
});

const sa = slice.actions;

/**
 * # Thunks of Battery Monitor
 */
export const tBM = {
  init: () => {
    return async (dispatch: AppDispatch) => {
      db.load().then((conf) => dispatch(sa.init(conf)));
    };
  },

  setState: (state: BatState) => {
    return (dispatch: AppDispatch) => dispatch(sa.setBatState(state));
  },

  setLevels: (lower: number, upper: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.setLevels({ lower, upper }));
  },

  setAllowed: (to: boolean) => {
    return (dispatch: AppDispatch) => dispatch(sa.setAllowed(to));
  },
};

export default slice.reducer;
