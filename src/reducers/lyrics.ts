import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { fetchYaml, toggle } from "../utils";
import type { State } from "../types/lyrics";
import { save, load, parseYaml } from "../services/lyrics";

const slice = createSlice({
  name: "lyrics",
  initialState: { artists: [], active: [] },
  reducers: {
    init: (_, { payload }) => {
      return payload;
    },

    setActive: (state: State, { payload }: PayloadAction<string>) => {
      toggle(state!.active, payload);
      save(state);
    },

    reset: (state: State) => {
      state.active = [];
      save(state);
    },
  },
});

export const { init, setActive, reset } = slice.actions;

export function initLyrics() {
  return (dp: AppDispatch) =>
    Promise.all([fetchYaml("/lyrics.yaml").then(parseYaml), load()]).then(
      ([artists, active]) => dp(init({ artists, active }))
    );
}

export function toggleSelection(key: string) {
  return (dp: AppDispatch) => dp(setActive(key));
}

export function restSelection() {
  return (dp: AppDispatch) => dp(reset());
}

export default slice.reducer;
