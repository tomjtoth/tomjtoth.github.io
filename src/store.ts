import { configureStore } from "@reduxjs/toolkit";

import cv, { tCV } from "./reducers/cv";
import batteryMonitor from "./reducers/battery-monitor";
import spinner from "./reducers/spinner";
import sidepanel from "./reducers/sidepanel";
import lyrics, { tLyr } from "./reducers/lyrics";
import shoppingList, { tSL } from "./reducers/shopping-list";
import arxFatalis, { tArx } from "./reducers/arx-fatalis";
import luxor from "./reducers/luxor";
import visitors, { tVis } from "./reducers/visitors";
import quotes, { tQt } from "./reducers/quotes";
import speechSynth, { tSS } from "./reducers/speech-synth";
import { sleep } from "./utils";

export const store = configureStore({
  reducer: {
    cv,
    batteryMonitor,
    spinner,
    sidepanel,
    lyrics,
    shoppingList,
    arxFatalis,
    luxor,
    visitors,
    quotes,
    speechSynth,
  },
});

window.addEventListener("load", async () => {
  for (const [ms, init] of [
    [0, tSS.init],
    [5, tArx.init],

    // fetching & parsing files
    [20, tVis.init],
    [20, tQt.init],
    [20, tSL.init],
    [20, tLyr.init],
    [20, tCV.init],
  ]) {
    await sleep(ms as number);
    store.dispatch((init as any)());
  }
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
