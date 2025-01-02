import { v4 as uuidv4 } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { storeObject, loadObject, fetchYaml } from "../utils";

const name = "shopping-list";
const re = {
  item: /(?:(?:\[`(?<nameUrl>[^`]+)`\]\((?<url>.+)\))|`(?<name>[^`]+)`)(?: *[-:])?/g,
  filter: /^recipe(?:-\d+|s)$/,
  // both versions must be fool-proofed
  strong: /(?:\*\*(?<vAsterisk>[^*]+)\*\*|\b__(?<vUnderscore>[^_]+)__\b)/g,
};

function save({ recipes, ...state }) {
  storeObject(name, state);
  return { recipes, ...state };
}

const slice = createSlice({
  name,
  initialState: loadObject(name, { items: [], active: ["recipes"] }),
  reducers: {
    fetchRecipes: (state, { payload }) => {
      return {
        ...state,
        recipes: Object.entries(payload)
          .toSorted(([a], [b]) => {
            const a3 = a.slice(3).toLowerCase();
            const b3 = b.slice(3).toLowerCase();

            if (a3 < b3) return -1;
            if (a3 > b3) return 1;
            return 0;
          })
          .map(([title, { steps, ...recipe }]) => {
            const items = [];

            const htmlSteps = steps.map((step) =>
              step
                .replaceAll(re.item, (_, nameUrl, url, name) => {
                  items.push(name || nameUrl);
                  return url
                    ? `<code class="recipe-item">${nameUrl}</code>
                    <a class="recipe-item" href="${url}" target="_blank">🔗</a>`
                    : `<code class="recipe-item">${name}</code>`;
                })
                .replaceAll(
                  re.strong,
                  (_, vAsterisk, vUnderscore) =>
                    ` <strong>${vAsterisk || vUnderscore}</strong> `
                )
            );

            return [
              title,
              {
                ...recipe,
                items,
                steps: htmlSteps,
              },
            ];
          }),
      };
    },
    toggle: ({ active, ...state }, { payload }) => {
      const next = {
        ...state,
        active: active.toToggled(payload),
      };
      return save(next);
    },
    reset: ({ active, ...state }) => {
      const next = {
        ...state,
        active: active.filter((key) => re.filter.test(key)),
      };
      return save(next);
    },
    add_item: ({ items, ...state }, { payload }) => {
      const next = {
        ...state,
        //TODO: is v4 the best?
        items: items.concat({ key: `item-${uuidv4()}`, item: payload }),
      };
      return save(next);
    },
    rm_item: ({ items, active, ...state }, { payload }) => {
      const next = {
        ...state,
        items: items.filter(({ key }) => key !== payload),
        active: active.filter((key) => key !== payload),
      };
      return save(next);
    },
  },
});

const { fetchRecipes, toggle, reset, add_item, rm_item } = slice.actions;

export const initRecipes = () => {
  return async (dispatch) => {
    dispatch(fetchRecipes(await fetchYaml("/recipes.yaml")));
  };
};

export const toggleActive = (key) => {
  return (dispatch) => {
    dispatch(toggle(key));
  };
};
export const addItem = (item) => {
  return (dispatch) => {
    dispatch(add_item(item));
  };
};
export const rmItem = (key) => {
  return (dispatch) => {
    dispatch(rm_item(key));
  };
};

export function resetSelected() {
  return function (dispatch) {
    dispatch(reset());
  };
}

export default slice.reducer;
