import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { Data, Quote, RState } from "../types/quotes";
import db from "../services/quotes";
import { toggle } from "../utils";

const slice = createSlice({
  name: "quotes",
  initialState: {
    loaded: false,
    active: [],
    data: [],
  } as RState,

  reducers: {
    init: (_, { payload: { data, active } }) => ({
      loaded: true,
      data: [data],
      active,
    }),

    toggle: (rs, { payload }) => {
      toggle(rs.active, payload);
      db.save(rs);
    },

    reset: (rs) => {
      rs.active = [];
      db.save(rs);
    },
  },
});

const sa = slice.actions;

const WORD = /\w+/g;

function recurse(rawData: any): Omit<Data, "name"> {
  let words = 0;

  const items = Object.entries(rawData).map(([name, value]) => {
    if (typeof value === "string") {
      const w = [...value.matchAll(WORD)].length;
      words += w;

      return {
        quote: value,
        words: w,
      } as Quote;
    } else {
      const res = recurse(value);
      words += res.words;
      return { name, ...res } as Data;
    }
  });

  return { words, items: items };
}

export const qts = {
  init: () => {
    return (dispatch: AppDispatch) => {
      return Promise.all([
        import("js-yaml"),
        import("../assets/quotes.yaml?raw"),
        db.load(),
      ]).then(([YAML, { default: strYaml }, active]) => {
        const parsed = YAML.load(strYaml) as any;

        const data = recurse(parsed);

        return dispatch(sa.init({ active, data }));
      });
    };
  },

  toggle: (id: string) => {
    return (dispatch: AppDispatch) => {
      console.debug(`toggling quotes item "${id}"`);
      return dispatch(sa.toggle(id));
    };
  },

  reset: () => {
    return (dispatch: AppDispatch) => dispatch(sa.reset());
  },
};

export default slice.reducer;
