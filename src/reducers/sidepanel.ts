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

/**
 * # Thunks of Sidepanel
 */
export const tSP = {
  show: () => {
    return (dispatch: AppDispatch) => dispatch(sa.set(true));
  },

  hide: () => {
    return (dispatch: AppDispatch) => {
      new Promise<void>((done) =>
        setTimeout(() => {
          dispatch(sa.set(false));
          done();
        })
      );
    };
  },
};

export default slice.reducer;
