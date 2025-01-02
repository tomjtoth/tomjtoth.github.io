import { createSlice } from "@reduxjs/toolkit";
import { storeObject, loadObject, fetchYaml } from "../utils";

const name = "lyrics";

function save({ artists, ...state }) {
  storeObject(name, state);
  return { artists, ...state };
}

const slice = createSlice({
  name,
  initialState: loadObject(name, {
    active: [],
  }),
  reducers: {
    load: (state, { payload }) => {
      return {
        ...state,
        artists: Object.entries(payload)
          .toSorted(([artist_a], [artist_b]) => {
            const lower_a = artist_a.toLowerCase();
            const lower_b = artist_b.toLowerCase();

            if (lower_a < lower_b) return -1;
            if (lower_a > lower_b) return 1;
            return 0;
          })
          .map(([artist, { url, ...albums }]) => {
            const sorted = Object.entries(albums).toSorted(
              ([title_a, a], [title_b, b]) => {
                // move the mix album to the beginning
                if (title_a === "null") return -1;
                if (title_b === "null") return 1;

                // order by year DESC
                if (a.year === undefined) return 1;
                if (b.year === undefined) return -1;
                const year_diff = b.year - a.year;

                if (year_diff === 0) {
                  const lower_a = title_a.toLowerCase();
                  const lower_b = title_b.toLowerCase();

                  // order alphabetically within the same year
                  if (lower_a < lower_b) return -1;
                  if (lower_a > lower_b) return 1;
                }

                return year_diff;
              }
            );

            return [artist, { url, albums: sorted }];
          }),
      };
    },
    toggle: ({ active, ...state }, { payload }) => {
      return save({ ...state, active: active.toToggled(payload) });
    },
    reset: ({ artists }) => {
      return save({ artists, active: [], scrollTop: 0 });
    },
  },
});

export const { load, toggle } = slice.actions;

export const initLyrics = () => {
  return async (dispatch) => {
    dispatch(load(await fetchYaml("/lyrics.yaml")));
  };
};

export function toggle_active(key) {
  return (dispatch) => {
    dispatch(toggle(key));
  };
}

export default slice.reducer;
