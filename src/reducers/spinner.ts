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

export function reset() {
  console.debug("resetting spinner to deafult");
  return (dp: AppDispatch) => dp(sa.set(DEFAULT));
}

export function fadeOut() {
  console.debug("fading out spinner");
  return (dp: AppDispatch) =>
    dp(sa.set({ active: true, className: "fade-out" }));
}

export function show() {
  console.debug("showing spinner");
  return (dp: AppDispatch) => dp(sa.set({ active: true }));
}

export default slice.reducer;
