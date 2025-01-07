import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";

const name = "sidepanel";

const slice = createSlice({
  name,
  initialState: loadObject(name, { active: false }),
  reducers: {
    setActive: ({ active, ...state }, { payload }) => {
      return storeObject(name, {
        ...state,
        active: payload === undefined ? !active : payload,
      });
    },
  },
});

const { setActive } = slice.actions;

export const setSidepanel = (to) => (dispatch) => dispatch(setActive(to));

export default slice.reducer;
