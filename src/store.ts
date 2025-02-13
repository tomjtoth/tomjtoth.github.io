import { configureStore } from "@reduxjs/toolkit";

import batteryMonitor from "./reducers/battery-monitor";
import spinner from "./reducers/spinner";
import sidepanel from "./reducers/sidepanel";
import lyrics from "./reducers/lyrics";
import shoppingList from "./reducers/shopping-list";
import arxFatalis from "./reducers/arx-fatalis";
import luxor from "./reducers/luxor";

export const store = configureStore({
  reducer: {
    batteryMonitor,
    spinner,
    sidepanel,
    lyrics,
    shoppingList,
    arxFatalis,
    luxor,
  },
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
