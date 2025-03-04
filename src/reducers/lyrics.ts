import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { toggle } from "../utils";
import type { State } from "../types/lyrics";
import db, { parseYaml } from "../services/lyrics";

const slice = createSlice({
  name: "lyrics",
  initialState: { artists: [], active: [] } as State,
  reducers: {
    init: (_, { payload }) => payload,

    toggleActive: (state, { payload }: PayloadAction<string>) => {
      toggle(state.active, payload);
      console.debug(`toggling ${payload}`);
      db.save(state);
    },

    resetActive: (state) => {
      state.active = [];
      db.save(state);
    },
  },
});

const sa = slice.actions;

/**
 * # Thunks of Lyrics
 */
export const tLyr = {
  init: () => {
    return (dispatch: AppDispatch) =>
      Promise.all([
        import("js-yaml"),
        import("../assets/lyrics.yaml?raw"),
        db.load(),
      ]).then(([YAML, { default: strYaml }, active]) => {
        const artists = parseYaml(YAML.load(strYaml));

        return dispatch(sa.init({ artists, active }));
      });
  },

  toggle: (id: string) => {
    return (dispatch: AppDispatch) => dispatch(sa.toggleActive(id));
  },

  reset: () => {
    return (dispatch: AppDispatch) => dispatch(sa.resetActive());
  },
};

export default slice.reducer;
