import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { State } from "../types/shopping-list";
import { maxId } from "../utils";
import db, { parseYaml } from "../services/shopping-list";

const RE_NUMS = /\d+/;
const RE_RECIPE_ID = /^slr(?:-\d+)?$/;

const slice = createSlice({
  name: "shopping-list",
  initialState: { recipes: [], items: [], active: [] } as State,
  reducers: {
    init: (_, { payload }: PayloadAction<State>) => payload,

    toggleActive: (state, { payload }) => {
      if (state.active.includes(payload)) {
        state.active = state.active.filter((id) =>
          payload === "slr"
            ? id !== payload
            : id !== payload && !id.startsWith(`${payload}-`)
        );
      } else {
        state.active.push(payload);
      }

      db.saveActive(state);
    },

    resetActiveItems: (state) => {
      state.active = state.active.filter((key) => RE_RECIPE_ID.test(key));
      db.saveActive(state);
    },

    addItem: (state, { payload }) => {
      const id = maxId(state.items) + 1;
      state.items.push({ id, name: payload });
      db.saveItems(state);
    },

    rmItem: (state, { payload }: PayloadAction<string>) => {
      const id = Number(payload.match(RE_NUMS)![0]);
      state.items = state.items.filter((i) => i.id !== id);
      db.rmItem(id);

      state.active = state.active.filter((id) => id !== payload);
      db.saveActive(state);
    },
  },
});

const sa = slice.actions;

export function initSL() {
  return async (dispatch: AppDispatch) => {
    return Promise.all([
      db.load(),
      import("js-yaml"),
      import("../assets/recipes.yaml?raw"),
    ]).then(([[active, items], YAML, { default: strYaml }]) =>
      dispatch(
        sa.init({
          recipes: parseYaml(YAML.load(strYaml)),
          active,
          items,
        })
      )
    );
  };
}

export function toggleActiveSL(id: string) {
  return (dispatch: AppDispatch) => dispatch(sa.toggleActive(id));
}

export function addItemSL(item: string) {
  return (dispatch: AppDispatch) => dispatch(sa.addItem(item));
}

export function rmItemSL(id: string) {
  return (dispatch: AppDispatch) => dispatch(sa.rmItem(id));
}

export function resetActiveSL() {
  return (dispatch: AppDispatch) => dispatch(sa.resetActiveItems());
}

export default slice.reducer;
