import { createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import { Visit } from "../types/visitors";

type ReducerState = {
  next?:
    | (Visit & {
        epoch: number;
        opening: string;
      })
    | null;
};

const slice = createSlice({
  name: "visitors",
  initialState: {} as ReducerState,

  reducers: {
    init: (_, { payload }) => payload,
  },
});

const sa = slice.actions;

const CONSONANTS = /^[bcdfghjklmnpqrstvwxz]/i;

export const vis = {
  init: () => {
    return (dispatch: AppDispatch) =>
      Promise.all([
        import("luxon"),
        import("js-yaml"),
        import("../assets/visitors.yaml?raw"),
      ]).then(([{ DateTime }, YAML, { default: strYaml }]) => {
        let epoch;
        let next = null;
        const visits = YAML.load(strYaml);

        const nextVisit = (visits as Visit[]).find((v) => {
          const v_epoch = DateTime.fromISO(v.arrival, {
            zone: "Europe/Helsinki",
          })
            .toUTC()
            .toMillis();

          if (Date.now() < v_epoch) {
            epoch = v_epoch;
            return true;
          }
          return false;
        });

        if (nextVisit) {
          const opening = `${nextVisit.name.includes("+") ? "Jönnek" : "Jön"} ${
            CONSONANTS.test(nextVisit.name) ? "a" : "az"
          } `;

          next = {
            ...nextVisit,
            opening,
            epoch,
          };
        }
        dispatch(sa.init({ next }));
      });
  },
};

export default slice.reducer;
