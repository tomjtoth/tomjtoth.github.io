import { configureStore } from "@reduxjs/toolkit";
import lyrics from "./reducers/lyrics";

export default configureStore({
  reducer: {
    lyrics,
  },
});
