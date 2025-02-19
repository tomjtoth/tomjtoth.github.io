import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";

const slice = createSlice({
  name: "sidepanel",
  initialState: false,
  reducers: {
    set: (_, { payload }) => {
      console.debug(`${payload ? "showing" : "hiding"} sidepanel`);
      return payload;
    },
  },
});

const sa = slice.actions;

export function showSidepanel() {
  return (dispatch: AppDispatch) => dispatch(sa.set(true));
}

export function hideSidepanel() {
  return (dispatch: AppDispatch) => {
    new Promise<void>((done) =>
      setTimeout(() => {
        dispatch(sa.set(false));
        done();
      })
    );
  };
}

export default slice.reducer;
