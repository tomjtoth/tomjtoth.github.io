import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { State } from "../types/shopping-list";
import { fetchYaml, maxId } from "../utils";
import db, { parseYaml } from "../services/shopping-list";
import { re } from "../components/ShoppingList/config";

const slice = createSlice({
  name: "shopping-list",
  initialState: { recipes: [], items: [], active: [] } as State,
  reducers: {
    init: (_, { payload }: PayloadAction<State>) => payload,

    toggleActive: (state, { payload }) => {
      if (state.active.includes(payload)) {
        state.active = state.active.filter((id) => !id.startsWith(payload));
      } else {
        state.active.push(payload);
      }

      db.saveActive(state);
    },

    resetActiveItems: (state) => {
      state.active = state.active.filter((key) => re.isRecipe.test(key));
      db.saveActive(state);
    },

    addItem: (state, { payload }) => {
      const id = maxId(state.items) + 1;
      state.items.push({ id, item: payload });
      db.saveItems(state);
    },

    rmItem: (state, { payload }) => {
      state.items = state.items.filter(({ id }) => id !== payload);
      db.rmItem(payload);

      state.active = state.active.filter((id) => id !== payload);
      db.saveActive(state);
    },
  },
});

const act = slice.actions;

export function init() {
  return async (dispatch: AppDispatch) => {
    const [active, items] = await db.load();

    dispatch(
      act.init({
        recipes: parseYaml(await fetchYaml("/recipes.yaml")),
        active,
        items,
      })
    );
  };
}

export function toggleActive(id: string) {
  return (dispatch: AppDispatch) => dispatch(act.toggleActive(id));
}

export function addItem(item: string) {
  return (dispatch: AppDispatch) => dispatch(act.addItem(item));
}

export function rmItem(key: string) {
  return (dispatch: AppDispatch) => dispatch(act.rmItem(key));
}

export function resetActiveItems() {
  return (dispatch: AppDispatch) => dispatch(act.resetActiveItems());
}

export default slice.reducer;
