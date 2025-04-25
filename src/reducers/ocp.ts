import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";

const slice = createSlice({
  name: "ocp",
  initialState: {
    chars: [],
    loaded: false,
  },

  reducers: {
    init: () => {},
  },
});

const sa = slice.actions;

/**
 * # Thunks of OCP
 */
export const tOCP = {
  init: () => (dispatch: AppDispatch) => {
    return dispatch(sa.init());
  },
};

export default slice.reducer;
