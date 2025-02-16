import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { TCV, RedState } from "../types/cv";
import { xxToFlags } from "../utils";

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

export function setCV({ personal: p, education: edu, experience: exp }: TCV) {
  return (dp: AppDispatch) =>
    dp(
      sa.setCV({
        personal: {
          ...p,
          city: xxToFlags(p.city),
          nationality: xxToFlags(p.nationality),
        },
        education: edu.map((e) => ({ ...e, city: xxToFlags(e.city) })),
        experience: exp.map((e) => ({ ...e, city: xxToFlags(e.city) })),
      })
    );
}

export function setImg(img: string) {
  return (dp: AppDispatch) => dp(sa.setImg(img));
}

export function setURL(url: string) {
  return (dp: AppDispatch) => dp(sa.setURL(url));
}

export default slice.reducer;
