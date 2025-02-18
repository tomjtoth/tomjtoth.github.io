import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";

type State = {
  active: boolean;
  className?: string;
};

const DEFAULT = {
  active: false,
} as State;

const slice = createSlice({
  name: "spinner",
  initialState: DEFAULT,
  reducers: {
    set: (_, { payload }) => payload,
  },
});

const sa = slice.actions;

export function resetSpinner() {
  console.debug("resetting spinner to deafult");
  return (dispatch: AppDispatch) => dispatch(sa.set(DEFAULT));
}

export function hideSpinner() {
  console.debug("fading out spinner");
  return (dispatch: AppDispatch) =>
    dispatch(sa.set({ active: true, className: "fade-out" }));
}

export function showSpinner() {
  console.debug("showing spinner");
  return (dispatch: AppDispatch) => dispatch(sa.set({ active: true }));
}

export default slice.reducer;
