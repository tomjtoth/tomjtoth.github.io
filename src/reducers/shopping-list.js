import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "shoppingList",
  initialState: {},
  reducers: {
    loadRecipies: (state, { payload }) => {
      return { ...state, recipies: payload };
    },
    reset_highlights: () => {},
    randomize_menus: () => {},
    add_menu: () => {},
    add_item: () => {},
  },
});

export const {
  loadRecipies,
  reset_highlights,
  randomize_menus,
  add_menu,
  add_item,
} = slice.actions;

export const initRecipies = () => {
  return async (dispatch) => {
    dispatch(loadRecipies(await svc.load()));
  };
};

export default slice.reducer;
