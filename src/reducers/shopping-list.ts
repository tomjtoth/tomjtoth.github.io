import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { Item, Recipe } from "../types/shopping-list";
import { storeObject, loadObject, fetchYaml, toggle } from "../utils";

const name = "shopping-list";
const re = {
  item: /(?:(?:\[`(?<nameUrl>[^`]+)`\]\((?<url>.+)\))|`(?<name>[^`]+)`)(?: *[-:])?/g,
  filter: /^recipe(?:-\d+|s)$/,
  // both versions must be fool-proofed
  strong: /(?:\*\*(?<vAsterisk>[^*]+)\*\*|\b__(?<vUnderscore>[^_]+)__\b)/g,
};

type State = {
  recipes: Recipe[];
  items: Item[];
  active: string[];
};

function save({ recipes, ...state }: State) {
  storeObject(name, state);
}

const slice = createSlice({
  name,
  initialState: {
    ...loadObject(name, {
      items: [],
      active: ["recipes"],
    }),
    recipes: [],
  },
  reducers: {
    fetchRecipes: (state: State, { payload }) => {
      state.recipes = Object.entries(payload)
        .toSorted(([a], [b]) => {
          const a3 = a.slice(3).toLowerCase();
          const b3 = b.slice(3).toLowerCase();

          if (a3 < b3) return -1;
          if (a3 > b3) return 1;
          return 0;
        })
        .map(([title, x]) => {
          const { steps, ...recipe } = x as Recipe;

          const items: string[] = [];

          const htmlSteps = steps.map((step) =>
            step
              .replaceAll(
                re.item,
                (
                  _: string,
                  nameUrl: string | undefined,
                  url: string | undefined,
                  name: string | undefined
                ) => {
                  items.push(name ?? nameUrl!);
                  return url
                    ? `<code class="recipe-item">${nameUrl}</code>
                    <a class="recipe-item" href="${url}" target="_blank">🔗</a>`
                    : `<code class="recipe-item">${name}</code>`;
                }
              )
              .replaceAll(
                re.strong,
                (
                  _: string,
                  vAsterisk: string | undefined,
                  vUnderscore: string | undefined
                ) => ` <strong>${vAsterisk ?? vUnderscore!}</strong> `
              )
          );

          return {
            ...recipe,
            title,
            items,
            steps: htmlSteps,
          };
        });
    },

    toggleActive: (state, { payload }) => {
      toggle(state.active, payload);
      save(state);
    },

    reset: (state) => {
      state.active = state.active.filter((key) => re.filter.test(key));
      save(state);
    },

    add_item: (state: State, { payload }) => {
      state.items.push({ key: uuid(), item: payload });
      save(state);
    },

    rm_item: (state, { payload }) => {
      state.items = state.items.filter(({ key }) => key !== payload);
      state.active = state.active.filter((key) => key !== payload);
      save(state);
    },
  },
});

const { fetchRecipes, toggleActive, reset, add_item, rm_item } = slice.actions;

export const initRecipes = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchRecipes(await fetchYaml("/recipes.yaml")));
  };
};

export const toggleActiveId = (key: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(toggleActive(key));
  };
};

export const addItem = (item: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(add_item(item));
  };
};

export const rmItem = (key: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(rm_item(key));
  };
};

export function resetSelected() {
  return function (dispatch: AppDispatch) {
    dispatch(reset());
  };
}

export default slice.reducer;
