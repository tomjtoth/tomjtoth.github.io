import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { CVDetails } from "../types/cv";

type State = {
  img: string;
  cv?: CVDetails;
};

const slice = createSlice({
  name: "cv",
  initialState: {
    img: "https://upload.wikimedia.org/wikipedia/en/c/c5/Rincewind.png",
  } as State,

  reducers: {
    setCV: (rs, { payload }) => {
      rs.cv = payload;
    },

    setImg: (rs, { payload }) => {
      rs.img = payload;
    },
  },
});

const sa = slice.actions;

export function setCV(cv: CVDetails) {
  return (dp: AppDispatch) => dp(sa.setCV(cv));
}
export function setImg(img: string) {
  return (dp: AppDispatch) => dp(sa.setImg(img));
}

export default slice.reducer;
