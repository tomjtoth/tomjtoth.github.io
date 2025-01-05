import { configureStore } from "@reduxjs/toolkit";
import lyrics from "./reducers/lyrics";
import shoppingList from "./reducers/shopping-list";
import sidepanel from "./reducers/sidepanel";
import arxFatalis from "./reducers/arx-fatalis";
import luxor from "./reducers/luxor";
import batteryMonitor from "./reducers/battery-monitor";

export default configureStore({
  reducer: {
    lyrics,
    shoppingList,
    sidepanel,
    arxFatalis,
    luxor,
    batteryMonitor,
  },
});
