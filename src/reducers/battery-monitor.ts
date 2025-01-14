import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { loadObject, storeObject } from "../utils";
import { State } from "../types/battery-monitor";

const name = "battery-monitor";

function save(state: State) {
  storeObject(name, state);
}
const slice = createSlice({
  name,
  initialState: loadObject(name, { min_val: 20, max_val: 80, allowed: false }),
  reducers: {
    setLevels: (state: State, { payload }: PayloadAction<Partial<State>>) => {
      state.min_val = payload.min_val!;
      state.max_val = payload.max_val!;
      save(state);
    },

    setAllowed: (state, { payload }: PayloadAction<boolean | undefined>) => {
      state.allowed = payload === undefined ? !state.allowed : payload;
      save(state);
    },
  },
});

const { setLevels, setAllowed } = slice.actions;

export const saveLevels = (levels: Partial<State>) => (dispatch: AppDispatch) =>
  dispatch(setLevels(levels));

export const toggleActive = (to?: boolean) => (dispatch: AppDispatch) =>
  dispatch(setAllowed(to));

export default slice.reducer;
