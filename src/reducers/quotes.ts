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
    playback: {
      state: PB.Stopped,
      currentTime: 0,
      duration: 0,
    },
    wpm: 0,
    active: [],
    data: [],
  } as RState,

  reducers: {
    init: (rs, { payload: { data, active, wpm } }) => {
      rs.loaded = true;
      rs.data = [{ ...data, name: "Yhteensä" }];
      rs.wpm = wpm;
      rs.active = active;
    },

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
      db.save(rs);
    },

    setPBState: (rs, { payload }) => {
      rs.playback.state = payload;
      rs.playback.duration = payload === PB.Stopped ? 0 : CURR_AUDIO.duration;
    },

    updatePBTime: (rs) => {
      rs.playback.currentTime = CURR_AUDIO.currentTime;
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
const LOWERCASE = /[a-z]/;

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
          const simpleQuote = typeof value === "string";

          const quoteWithUrl =
            typeof value === "object" && "url" in value! && "quote" in value;

          const dangerousQuote =
            typeof value === "object" && "innerHTML" in value!;

          const dangerousQuoteWithUrl = dangerousQuote && "url" in value;

          if (
            simpleQuote ||
            quoteWithUrl ||
            dangerousQuote ||
            dangerousQuoteWithUrl
          ) {
            const pls = [] as string[];

            let val = dangerousQuote
              ? (value.innerHTML as string)
              : quoteWithUrl
              ? (value.quote as string)
              : (value as string);

            val = val.replaceAll(PUNCHLINE, (_, pl, firstChar, lastChar) => {
              pls.push(
                `${LOWERCASE.test(firstChar) ? "..." : ""}${pl}${
                  LOWERCASE.test(lastChar) ? "..." : ""
                }`
              );
              return pl;
            });

            const wc = [...val.matchAll(WORD)].length;
            words += wc;

            const res = {
              punchline: pls.length > 0 ? pls.join(" ") : undefined,
              words: wc,
            } as Quote;

            if (simpleQuote || quoteWithUrl)
              (res as { quote: string }).quote = val;
            if (dangerousQuote || dangerousQuoteWithUrl)
              (res as { innerHTML: string }).innerHTML = val;

            if (quoteWithUrl || dangerousQuoteWithUrl) {
              const url = value.url as string;
              const mp3 = new Audio(url);

              mp3.onended = () => dispatch(sa.setPBState(PB.Stopped));
              mp3.onpause = () => dispatch(sa.setPBState(PB.Paused));
              mp3.onplay = () => dispatch(sa.setPBState(PB.Playing));
              mp3.ontimeupdate = () => dispatch(sa.updatePBTime());

              HTML_AUDIO_ELEMENTS.set(url, mp3);

              res.audio = { url, state: PB.Stopped };
            }

            return res;
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

  seek: (timeStr: string) => () => {
    CURR_AUDIO.currentTime = Number(timeStr);
  },

  play:
    (url?: string) => (dispatch: AppDispatch, getState: () => RootState) => {
      const pbSpeech = getState().speechSynth.playback.state;

      if (pbSpeech !== PB.Stopped) dispatch(tSS.stop());

      if (url) {
        const mp3 = HTML_AUDIO_ELEMENTS.get(url)!;
        if (CURR_AUDIO && CURR_AUDIO !== mp3) {
          CURR_AUDIO.pause();
          CURR_AUDIO.currentTime = 0;
        }
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
    if (rs.playback.state === PB.Playing) {
      const len = CURR_AUDIO.duration;
      CURR_AUDIO.currentTime = len;
    } else {
      CURR_AUDIO.currentTime = 0;
      dispatch(sa.setPBState(PB.Stopped));
    }
  },
};

export default slice.reducer;
