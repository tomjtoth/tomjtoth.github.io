import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { loadObject, storeObject } from "../utils";

const name = "sidepanel";

const slice = createSlice({
  name,
  initialState: loadObject(name, { active: false }),
  reducers: {
    setActive: (state, { payload }) => {
      state.active = payload === undefined ? !state.active : payload;
      storeObject(name, state);
    },
  },
});

const sa = slice.actions;

export function setSidepanel(to?: boolean) {
  return (dispatch: AppDispatch) => dispatch(sa.setActive(to));
}

export default slice.reducer;
