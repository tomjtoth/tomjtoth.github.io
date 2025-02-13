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

export function setSidepanel(to: boolean) {
  return (dp: AppDispatch) => dp(sa.set(to));
}

export default slice.reducer;
