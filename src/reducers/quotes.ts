import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../store";
import { PlaybackState as PB } from "../types";
import { Data, Quote, RState } from "../types/quotes";
import db from "../services/quotes";
import { toggle } from "../utils";
import { tSS } from ".";

const slice = createSlice({
  name: "quotes",
  initialState: {
    loaded: false,
    pbState: PB.Stopped,
    wpm: 0,
    active: [],
    data: [],
  } as RState,

  reducers: {
    init: (_, { payload: { data, active, wpm } }) => ({
      loaded: true,
      pbState: PB.Stopped,
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

    setPBState: (rs, { payload }) => {
      rs.pbState = payload;
    },
  },
});

// function dig(rs: WritableDraft<RState>, indices: number[]) {
//   let node = rs.data;
//   let quote = null as null | Quote;

//   for (const i of indices) {
//     if ("quote" in node[i]) {
//       quote = node[i] as Quote;
//     } else {
//       node = node[i].items as Data[];
//     }
//   }

//   return { quote: quote!, audio: HTML_AUDIO_ELEMENTS.get(quote!.audio?.url!)! };
// }

const sa = slice.actions;

const WORD = /\w+/g;
const PUNCHLINE = /\*\*((.).+?(.))\*\*/g;

const HTML_AUDIO_ELEMENTS = new Map<string, HTMLAudioElement>();
let CURR_AUDIO: HTMLAudioElement;

/**
 * # Thunks of Quotes
 */
export const tQt = {
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

              mp3.onended = () => dispatch(sa.setPBState(PB.Stopped));
              mp3.onpause = () => dispatch(sa.setPBState(PB.Paused));
              mp3.onplay = () => dispatch(sa.setPBState(PB.Playing));

              HTML_AUDIO_ELEMENTS.set(url, mp3);

              audio = { url, state: PB.Stopped };
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

  play:
    (url?: string) => (dispatch: AppDispatch, getState: () => RootState) => {
      const pbSpeech = getState().speechSynth.pbState;

      if (pbSpeech !== PB.Stopped) dispatch(tSS.stop());

      if (url) {
        const mp3 = HTML_AUDIO_ELEMENTS.get(url)!;
        mp3.play();
        CURR_AUDIO = mp3;
      } else {
        CURR_AUDIO.play();
      }
    },

  pause: () => () => {
    CURR_AUDIO.pause();
  },

  stop: () => (dispatch: AppDispatch, getRootState: () => RootState) => {
    const rs = getRootState().quotes;
    if (rs.pbState === PB.Playing) {
      const len = CURR_AUDIO.duration;
      CURR_AUDIO.currentTime = len;
    } else {
      CURR_AUDIO.currentTime = 0;
      dispatch(sa.setPBState(PB.Stopped));
    }
  },
};

export default slice.reducer;
