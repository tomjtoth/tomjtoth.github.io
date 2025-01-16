import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { loadObject, storeObject } from "../utils";
import { Levels, State } from "../types/battery-monitor";

const name = "battery-monitor";

const slice = createSlice({
  name,
  initialState: loadObject(name, {
    min_val: 20,
    max_val: 80,
    allowed: false,
  }) as State,

  reducers: {
    setLevels: (state, { payload }: PayloadAction<Levels>) => {
      state.min_val = payload.min_val;
      state.max_val = payload.max_val;
      storeObject(name, state);
    },

    setAllowed: (state, { payload }: PayloadAction<boolean | undefined>) => {
      state.allowed = payload === undefined ? !state.allowed : payload;
      storeObject(name, state);
    },
  },
});

const sa = slice.actions;

export function setLevels(levels: Levels) {
  return (dispatch: AppDispatch) => dispatch(sa.setLevels(levels));
}

export function setAllowed(to?: boolean) {
  return (dispatch: AppDispatch) => dispatch(sa.setAllowed(to));
}

export default slice.reducer;
