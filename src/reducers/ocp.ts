import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { State as RS } from "../types/ocp";

const slice = createSlice({
  name: "ocp",
  initialState: {
    characters: [],
    current: 0,
    loaded: false,
  } as RS,

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
