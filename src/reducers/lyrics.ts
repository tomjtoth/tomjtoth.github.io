import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { fetchYaml, toggle } from "../utils";
import type { State } from "../types/lyrics";
import db, { parseYaml } from "../services/lyrics";

const slice = createSlice({
  name: "lyrics",
  initialState: { artists: [], active: [] } as State,
  reducers: {
    init: (_, { payload }) => payload,

    toggleActive: (state, { payload }: PayloadAction<string>) => {
      toggle(state.active, payload);
      db.save(state);
    },

    resetActive: (state) => {
      state.active = [];
      db.save(state);
    },
  },
});

export const sa = slice.actions;

export function init() {
  return (dispatch: AppDispatch) =>
    Promise.all([fetchYaml("/lyrics.yaml").then(parseYaml), db.load()]).then(
      ([artists, active]) => dispatch(sa.init({ artists, active }))
    );
}

export function toggleSelection(id: string) {
  return (dispatch: AppDispatch) => dispatch(sa.toggleActive(id));
}

export function restSelection() {
  return (dispatch: AppDispatch) => dispatch(sa.resetActive());
}

export default slice.reducer;
