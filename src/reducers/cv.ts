import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { RedState } from "../types/cv";

const slice = createSlice({
  name: "cv",
  initialState: {
    img: "https://upload.wikimedia.org/wikipedia/en/c/c5/Rincewind.png",
  } as RedState,

  reducers: {
    setCV: (rs, { payload }) => {
      rs.cv = payload;
    },

    setImg: (rs, { payload }) => {
      rs.img = payload;
    },

    setURL: (rs, { payload }) => {
      rs.url = payload;
    },
  },
});

const sa = slice.actions;

export function setCV({ personal: p, education, experience }: any) {
  return (dp: AppDispatch) => {
    const citizenship = Object.entries(p.citizenship).map(
      ([flag, nationality]) => ({ flag, nationality })
    );

    const languages = Object.entries(p.languages).map(([flag, lang]) => ({
      flag,
      lang,
    }));

    return dp(
      sa.setCV({
        personal: {
          ...p,
          citizenship,
          languages,
        },
        education,
        experience,
      })
    );
  };
}

export function setImg(img: string) {
  return (dp: AppDispatch) => dp(sa.setImg(img));
}

export function setURL(url: string) {
  return (dp: AppDispatch) => dp(sa.setURL(url));
}

export default slice.reducer;
