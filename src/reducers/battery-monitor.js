import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";

const name = "battery-monitor";

const slice = createSlice({
  name,
  initialState: loadObject(name, { min_val: 20, max_val: 80, allowed: false }),
  reducers: {
    setLevels: ({ allowed }, { payload }) =>
      storeObject(name, { allowed, ...payload }),

    setAllowed: ({ allowed, ...state }, { payload }) =>
      storeObject(name, {
        ...state,
        allowed: payload === undefined ? !allowed : payload,
      }),
  },
});

const { setLevels, setAllowed } = slice.actions;

export const saveLevels = (levels) => (dispatch) => dispatch(setLevels(levels));
export const toggleActive = (bool) => (dispatch) => dispatch(setAllowed(bool));

export default slice.reducer;
