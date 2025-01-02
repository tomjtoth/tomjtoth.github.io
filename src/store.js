import { configureStore } from "@reduxjs/toolkit";
import lyrics from "./reducers/lyrics";
import shoppingList from "./reducers/shopping-list";
import sidepanel from "./reducers/sidepanel";
import runes from "./reducers/runes";
import luxor from "./reducers/luxor";

export default configureStore({
  reducer: {
    lyrics,
    shoppingList,
    sidepanel,
    runes,
    luxor,
  },
});
