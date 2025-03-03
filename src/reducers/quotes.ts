import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";

import { AppDispatch } from "../store";
import { PlaybackState as PBS } from "../types";
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

    play: (rs, { payload }: PayloadAction<number[]>) => {
      const { quote, audio } = dig(rs, payload);
      audio.play();
      quote.audio!.state = PBS.Playing;
    },

    pause: (rs, { payload }) => {
      const { quote, audio } = dig(rs, payload);
      audio.pause();
      quote.audio!.state = PBS.Paused;
    },

    stop: (rs, { payload }) => {
      const { quote, audio } = dig(rs, payload);
      audio.pause();
      audio.currentTime = 0.0;
      quote.audio!.state = PBS.Stopped;
    },
  },
});

function dig(rs: WritableDraft<RState>, indices: number[]) {
  let node = rs.data;
  let quote = null as null | Quote;

  for (const i of indices) {
    if ("quote" in node[i]) {
      quote = node[i] as Quote;
    } else {
      node = node[i].items as Data[];
    }
  }

  return { quote: quote!, audio: HTML_AUDIO_ELEMENTS.get(quote!.audio?.url!)! };
}

const sa = slice.actions;

const WORD = /\w+/g;
const PUNCHLINE = /\*\*((.).+?(.))\*\*/g;

const HTML_AUDIO_ELEMENTS = new Map<string, HTMLAudioElement>();

export const qts = {
  init: () => {
    return (dispatch: AppDispatch) => {
      function recurse(rawData: any, indices: number[]): Omit<Data, "name"> {
        let words = 0;

        const items = Object.entries(rawData).map(([name, value], i) => {
          const quoteWithUrl =
            typeof value === "object" && "url" in value! && "quote" in value;

          if (typeof value === "string" || quoteWithUrl) {
            const pls = [] as string[];

            let val = quoteWithUrl
              ? (value.quote as string)
              : (value as string);
            val = val.replaceAll(PUNCHLINE, (_, pl) => {
              pls.push(pl);
              return pl;
            });

            const wc = [...val.matchAll(WORD)].length;
            words += wc;

            let audio;
            if (quoteWithUrl) {
              const url = value.url as string;
              const mp3 = new Audio(url);

              mp3.onended = () => {
                dispatch(sa.stop([...indices, i]));
              };

              HTML_AUDIO_ELEMENTS.set(url, mp3);

              audio = { url, state: PBS.Stopped };
            }

            return {
              quote: val,
              audio,
              punchline: pls.length > 0 ? pls.join(" ") : undefined,
              words: wc,
            } as Quote;
          } else {
            const res = recurse(value, [...indices, i]);
            words += res.words;
            return { name, ...res } as Data;
          }
        });

        return { words, items };
      }

      return Promise.all([
        import("js-yaml"),
        import("../assets/quotes.yaml?raw"),
        db.load(),
      ]).then(([YAML, { default: strYaml }, { wpm, active }]) => {
        const parsed = YAML.load(strYaml) as any;

        const data = recurse(parsed, [0]);

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

  play: (indices: number[]) => (dispatch: AppDispatch) => {
    return dispatch(sa.play(indices));
  },

  pause: (indices: number[]) => (dispatch: AppDispatch) => {
    return dispatch(sa.pause(indices));
  },

  stop: (indices: number[]) => (dispatch: AppDispatch) => {
    return dispatch(sa.stop(indices));
  },
};

export default slice.reducer;
