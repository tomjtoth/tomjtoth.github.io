import { configureStore } from "@reduxjs/toolkit";
import lyrics from "./reducers/lyrics";
import shoppingList from "./reducers/shopping-list";
import sidepanel from "./reducers/sidepanel";
import arxFatalis from "./reducers/arx-fatalis";
import luxor from "./reducers/luxor";
import batteryMonitor from "./reducers/battery-monitor";

export const store = configureStore({
  reducer: {
    lyrics,
    shoppingList,
    sidepanel,
    arxFatalis,
    luxor,
    batteryMonitor,
  },
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
