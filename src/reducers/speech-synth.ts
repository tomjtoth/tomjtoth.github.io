import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../store";
import db from "../services/speech-synth";
import { PlaybackState as PB } from "../types";
import { tQt } from "./quotes";
import { SpeechManager } from "../types/speech-synth";

const isSupported = "speechSynthesis" in window;

type Selectable = {
  name: string;
  lang: string;
};

type RState = {
  isSupported: boolean;
  playback: {
    state: PB;
    progress: number;
  };
  voice: number;
  rate: number;
  pitch: number;
  selectables: Selectable[];
};

const slice = createSlice({
  name: "speech-synth",
  initialState: {
    isSupported,
    playback: {
      state: PB.Stopped,
      progress: 0,
    },
    voice: 0,
    rate: 1,
    pitch: 1,
    selectables: [],
  } as RState,

  reducers: {
    setConf: (rs, { payload: { voice, rate, pitch } }) => {
      if (voice) {
        rs.voice = voice;
        MANAGER.voice = voice;
      }

      if (rate) {
        rs.rate = rate;
        MANAGER.rate = rate;
      }

      if (pitch) {
        rs.pitch = pitch;
        MANAGER.pitch = pitch;
      }

      db.save(rs);
    },

    populateSelectorList: (rs, { payload }) => {
      rs.selectables = payload;
    },

    setPBState: (rs, { payload }) => {
      rs.playback.state = payload;
    },

    setProgress: (rs, { payload }) => {
      rs.playback.progress = payload;
    },
  },
});

const sa = slice.actions;

let MANAGER: SpeechManager;

/**
 * # Thunks of Speech Synthesis
 */
export const tSS = {
  init: () => (dispatch: AppDispatch) => {
    if (isSupported) {
      db.load().then(({ voice, rate, pitch }) => {
        MANAGER = new SpeechManager();
        dispatch(sa.setConf({ voice, rate, pitch }));
        dispatch(sa.populateSelectorList(MANAGER.getSelection()));
      });
    }
  },

  setVoice: (strIdx: string) => (dispatch: AppDispatch) => {
    const asNum = Number(strIdx);
    dispatch(sa.setConf({ voice: asNum }));
  },

  setRate: (strRate: string) => (dispatch: AppDispatch) => {
    const asNum = Number(strRate);
    dispatch(sa.setConf({ rate: asNum }));
  },

  setPitch: (strPitch: string) => (dispatch: AppDispatch) => {
    const asNum = Number(strPitch);
    dispatch(sa.setConf({ pitch: asNum }));
  },

  resume: () => (dispatch: AppDispatch) => {
    MANAGER.resume();
    dispatch(sa.setPBState(PB.Playing));
  },

  pause: () => (dispatch: AppDispatch) => {
    MANAGER.pause();
    dispatch(sa.setPBState(PB.Paused));
  },

  stop: () => (dispatch: AppDispatch) => {
    MANAGER.stop();
    dispatch(sa.setProgress(0));
    dispatch(sa.setPBState(PB.Stopped));
  },

  speak: (text: string) => {
    return (dispatch: AppDispatch, getRS: () => RootState) => {
      if (getRS().quotes.playback.state !== PB.Stopped) dispatch(tQt.stop());

      MANAGER.speak({
        text,
        onEnd: () => {
          dispatch(sa.setProgress(0));
          dispatch(sa.setPBState(PB.Stopped));
        },
        onProgress: (num: number) => dispatch(sa.setProgress(num)),
      });
      dispatch(sa.setPBState(PB.Playing));
    };
  },
};

export default slice.reducer;
