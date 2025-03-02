import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { Data, Quote, RState } from "../types/quotes";
import db from "../services/quotes";
import { toggle } from "../utils";

const slice = createSlice({
  name: "quotes",
  initialState: {
    loaded: false,
    wpm: 0,
    active: [],
    data: [],
  } as RState,

  reducers: {
    init: (_, { payload: { data, active, wpm } }) => ({
      loaded: true,
      data: [{ ...data, name: "Yhteensä" }],
      wpm,
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

    setWPM: (rs, { payload }) => {
      rs.wpm = payload;
    },
  },
});

const sa = slice.actions;

const WORD = /\w+/g;
const PUNCHLINE = /\*\*((.).+?(.))\*\*/g;

function recurse(rawData: any): Omit<Data, "name"> {
  let words = 0;

  const items = Object.entries(rawData).map(([name, value]) => {
    const quoteWithUrl =
      typeof value === "object" && "url" in value! && "quote" in value;

    if (typeof value === "string" || quoteWithUrl) {
      const pls = [] as string[];

      let val = quoteWithUrl ? (value.quote as string) : (value as string);
      val = val.replaceAll(PUNCHLINE, (_, pl) => {
        pls.push(pl);
        return pl;
      });

      const wc = [...val.matchAll(WORD)].length;
      words += wc;

      return {
        quote: val,
        punchline: pls.length > 0 ? pls.join(" ") : undefined,
        words: wc,
      } as Quote;
    } else {
      const res = recurse(value);
      words += res.words;
      return { name, ...res } as Data;
    }
  });

  return { words, items };
}

export const qts = {
  init: () => {
    return (dispatch: AppDispatch) => {
      return Promise.all([
        import("js-yaml"),
        import("../assets/quotes.yaml?raw"),
        db.load(),
      ]).then(([YAML, { default: strYaml }, { wpm, active }]) => {
        const parsed = YAML.load(strYaml) as any;

        const data = recurse(parsed);

        return dispatch(sa.init({ wpm, active, data }));
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

  setWPM: (wpm: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.setWPM(wpm));
  },
};

export default slice.reducer;
