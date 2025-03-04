import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";

type State = {
  visible: boolean;
  fading?: boolean;
};

const DEFAULT = {
  visible: false,
} as State;

const slice = createSlice({
  name: "spinner",
  initialState: DEFAULT,
  reducers: {
    set: (_, { payload }) => payload,
  },
});

const sa = slice.actions;

/**
 * # Thunks of Spinner
 */
export const tSpin = {
  reset: () => {
    console.debug("resetting spinner to default");
    return (dispatch: AppDispatch) => dispatch(sa.set(DEFAULT));
  },

  hide: () => {
    console.debug("fading out spinner");
    return (dispatch: AppDispatch) =>
      dispatch(sa.set({ visible: true, fading: true }));
  },

  show: () => {
    console.debug("showing spinner");
    return (dispatch: AppDispatch) => dispatch(sa.set({ visible: true }));
  },
};

export default slice.reducer;
