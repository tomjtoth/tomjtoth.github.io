import { createSlice } from "@reduxjs/toolkit";
import svc from "../services/lyrics";

const initialState = {
  active: [],
  artists: {},
};

const slice = createSlice({
  name: "lyrics",
  initialState,
  reducers: {
    load: (state, { payload }) => {
      return { ...state, artists: payload };
    },
    toggle: (state, { payload }) => {
      // maintaining state immutability?
      let new_active = [...state.active];

      if (new_active.indexOf(payload) === -1) {
        new_active.push(payload);
      } else {
        new_active = new_active.filter((key) => key !== payload);
      }

      return { ...state, active: new_active };
    },
    reset: ({ artists }) => ({ ...initialState, artists }),
  },
});

export const { load, toggle } = slice.actions;

export const initLyrics = () => {
  return async (dispatch) => {
    dispatch(load(await svc.load()));
  };
};

export function toggle_active(key) {
  return (dispatch) => {
    dispatch(toggle(key));
  };
}

export default slice.reducer;
