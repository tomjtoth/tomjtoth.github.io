import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../store";
import db from "../services/speech-synth";
import { PlaybackState as PBS } from "../types";
import { qts } from "./quotes";

const isSupported = "speechSynthesis" in window;
const SYNTH = window.speechSynthesis;

type Selectable = {
  name: string;
  lang: string;
};

type RState = {
  isSupported: boolean;
  pbState: PBS;
  voice: number;
  selectables: Selectable[];
};

const slice = createSlice({
  name: "speech-synth",
  initialState: {
    isSupported,
    pbState: PBS.Stopped,
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

export const ss = {
  init: () => (dispatch: AppDispatch) => {
    if (isSupported) {
      db.load().then(({ choice }) => dispatch(sa.setVoice(choice)));

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
    dispatch(sa.setPBState(PBS.Playing));
  },

  pause: () => (dispatch: AppDispatch) => {
    SYNTH.pause();
    dispatch(sa.setPBState(PBS.Paused));
  },

  stop: () => (dispatch: AppDispatch) => {
    SYNTH.cancel();
    dispatch(sa.setPBState(PBS.Stopped));
  },

  speak: (text: string) => {
    return (dispatch: AppDispatch, getRootState: () => RootState) => {
      const rs = getRootState();
      const speechState = rs.speechSynth;
      const pbQuotes = rs.quotes.pbState;

      if (pbQuotes !== PBS.Stopped) dispatch(qts.stop());

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = VOICES[speechState.voice];

      utterance.onend = () => {
        if (!SYNTH.pending) dispatch(sa.setPBState(PBS.Stopped));
      };

      SYNTH.cancel();
      SYNTH.speak(utterance);
      dispatch(sa.setPBState(PBS.Playing));
    };
  },
};

export default slice.reducer;
