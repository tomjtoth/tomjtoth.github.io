import { createSlice } from "@reduxjs/toolkit";
import svc from "../services/lyrics";

const slice = createSlice({
  name: "lyrics",
  initialState: {},
  reducers: {
    load: (_state, { payload }) => {
      return payload;
    },
  },
});

export const { load } = slice.actions;

export const initLyrics = () => {
  return async (dispatch) => {
    dispatch(load(await svc.load()));
  };
};

export default slice.reducer;
