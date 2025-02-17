import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { TCV, RedState } from "../types/cv";
import { FLAG_EXTRACTOR, ccToFlags } from "../utils";

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
  return (dp: AppDispatch) => {
    const cship = [p.citizenship].flat().map((nat) => {
      let flag = "🚩";

      nat = nat.replaceAll(FLAG_EXTRACTOR, (ff) => {
        flag = ccToFlags(ff);
        return "";
      });

      nat.trim();

      return [flag, nat];
    });

    return dp(
      sa.setCV({
        personal: {
          ...p,
          location: ccToFlags(p.location),
          cship,
        },
        education: edu.map((e) => ({ ...e, location: ccToFlags(e.location) })),
        experience: exp.map((e) => ({ ...e, location: ccToFlags(e.location) })),
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
