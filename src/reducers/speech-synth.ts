import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../store";
import db from "../services/speech-synth";
import { PlaybackState as PB } from "../types";
import { tQt } from "./quotes";

const isSupported = "speechSynthesis" in window;
const SYNTH = window.speechSynthesis;

type Selectable = {
  name: string;
  lang: string;
};

type RState = {
  isSupported: boolean;
  pbState: PB;
  voice: number;
  selectables: Selectable[];
};

const slice = createSlice({
  name: "speech-synth",
  initialState: {
    isSupported,
    pbState: PB.Stopped,
    voice: 0,
    selectables: [],
  } as RState,

  reducers: {
    setVoice: (rs, { payload }) => {
      rs.voice = payload;
    },

    populateSelectorList: (rs, { payload }) => {
      rs.selectables = payload;
    },

    setPBState: (rs, { payload }) => {
      rs.pbState = payload;
    },
  },
});

const sa = slice.actions;

let VOICES: SpeechSynthesisVoice[];

/**
 * # Thunks of Speech Synthesis
 */
export const tSS = {
  init: () => (dispatch: AppDispatch) => {
    if (isSupported) {
      db.load().then(({ voice }) => dispatch(sa.setVoice(voice)));

      VOICES = SYNTH.getVoices().toSorted((a, b) => {
        const lower_a = a.lang.toLowerCase();
        const lower_b = b.lang.toLowerCase();
        if (lower_a < lower_b) return -1;
        if (lower_a > lower_b) return 1;
        return 0;
      });

      dispatch(
        sa.populateSelectorList(
          VOICES.map(({ name, lang }) => ({ name, lang }))
        )
      );
      console.debug(VOICES.length, "synth voices loaded");
    }
  },

  setVoice: (idx: number) => (dispatch: AppDispatch) => {
    dispatch(sa.setVoice(idx));
    db.save(idx);
  },

  resume: () => (dispatch: AppDispatch) => {
    SYNTH.resume();
    dispatch(sa.setPBState(PB.Playing));
  },

  pause: () => (dispatch: AppDispatch) => {
    SYNTH.pause();
    dispatch(sa.setPBState(PB.Paused));
  },

  stop: () => (dispatch: AppDispatch) => {
    SYNTH.cancel();
    dispatch(sa.setPBState(PB.Stopped));
  },

  speak: (text: string) => {
    return (dispatch: AppDispatch, getRootState: () => RootState) => {
      const rs = getRootState();
      const speechState = rs.speechSynth;
      const pbQuotes = rs.quotes.pbState;

      if (pbQuotes !== PB.Stopped) dispatch(tQt.stop());

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = VOICES[speechState.voice];

      utterance.onend = () => {
        if (!SYNTH.pending) dispatch(sa.setPBState(PB.Stopped));
      };

      SYNTH.cancel();
      SYNTH.speak(utterance);
      dispatch(sa.setPBState(PB.Playing));
    };
  },
};

export default slice.reducer;
