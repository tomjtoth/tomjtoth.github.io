import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { EduDet, ExpDet, ReducerState } from "../types/cv";
import { ccToFlags } from "../utils";

const slice = createSlice({
  name: "cv",
  initialState: {
    img: "https://upload.wikimedia.org/wikipedia/en/c/c5/Rincewind.png",
  } as ReducerState,

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

    toggleRelevance: (rs, { payload: { exp, idx } }) => {
      const arr = exp ? rs.cv!.experience : rs.cv!.education;

      const rel = arr![idx].relevant ?? false;
      arr![idx].relevant = !rel;
    },
  },
});

const sa = slice.actions;

/**
 * # Thunks of CV
 */
export const tCV = {
  init: () => (dispatch: AppDispatch) => {
    Promise.all([import("js-yaml"), import("../assets/cv.yaml?raw")]).then(
      ([YAML, { default: strYaml }]) => {
        const flagsReplaced = ccToFlags(strYaml);
        const parsed = YAML.load(flagsReplaced);

        const blob = new Blob([strYaml], { type: "application/yaml" });
        const blobUrl = URL.createObjectURL(blob);

        dispatch(tCV.setURL(blobUrl));
        dispatch(tCV.setCV(parsed));
      }
    );
  },

  setCV: ({ personal: p, education: edu, experience: exp, skills }: any) => {
    return (dispatch: AppDispatch) => {
      const citizenship = Object.entries(p.citizenship).map(
        ([flag, nationality]) => ({ flag, nationality })
      );

      const languages = Object.entries(p.languages).map(([flag, lang]) => ({
        flag,
        lang,
      }));

      return dispatch(
        sa.setCV({
          personal: {
            ...p,
            citizenship,
            languages,
          },
          skills,
          education: edu.map((e: EduDet) => ({
            ...e,
            relevant: e.relevant ?? true,
          })),
          experience: exp.map((e: ExpDet) => ({
            ...e,
            relevant: e.relevant ?? true,
          })),
        })
      );
    };
  },

  setImg: (img: string) => {
    return (dispatch: AppDispatch) => dispatch(sa.setImg(img));
  },

  setURL: (url: string) => {
    return (dispatch: AppDispatch) => dispatch(sa.setURL(url));
  },

  toggle: (exp: boolean, idx: number) => {
    return (dispatch: AppDispatch) =>
      dispatch(sa.toggleRelevance({ exp, idx }));
  },
};

export default slice.reducer;
