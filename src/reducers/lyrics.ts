import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import {
  storeObject,
  loadObject,
  fetchYaml,
  toggle as toggleArr,
} from "../utils";
import type { Artist, Album, Song, State } from "../components/Lyrics/types";

const name = "lyrics";

function save({ artists, ...state }: State) {
  storeObject(name, state);
}

const slice = createSlice({
  name,
  initialState: {
    ...loadObject(name, {
      active: [],
    }),
    artists: [],
  },
  reducers: {
    load: (state: State, { payload }) => {
      state.artists = Object.entries(payload)
        .toSorted(([artist_a], [artist_b]) => {
          const lower_a = artist_a.toLowerCase();
          const lower_b = artist_b.toLowerCase();

          if (lower_a < lower_b) return -1;
          if (lower_a > lower_b) return 1;
          return 0;
        })

        .map(([artistName, artist]) => {
          const { url, ...albums } = artist as any;
          const sorted = Object.entries(albums)
            .toSorted(([title_a, a], [title_b, b]) => {
              // move the mix album to the beginning
              if (title_a === "null") return -1;
              if (title_b === "null") return 1;

              const yearA = (a as Album).year;
              const yearB = (b as Album).year;

              // order by year DESC
              if (yearA === undefined) return 1;
              if (yearB === undefined) return -1;
              const year_diff = yearB - yearA;

              if (year_diff === 0) {
                const lower_a = title_a.toLowerCase();
                const lower_b = title_b.toLowerCase();

                // order alphabetically within the same year
                if (lower_a < lower_b) return -1;
                if (lower_a > lower_b) return 1;
              }

              return year_diff;
            })
            .map(([title, album]) => {
              const { url, year, ...songs } = album as any;

              return {
                title,
                year,
                url,
                songs: Object.entries(songs).map(
                  ([title, lyrics]) =>
                    ({
                      title,
                      lyrics,
                    } as Song)
                ),
              } as Album;
            });

          return { name: artistName, url, albums: sorted } as Artist;
        });
    },

    toggleActive: (
      { active, ...state }: State,
      { payload }: PayloadAction<number[]>
    ) => {
      toggleArr(active, payload);
      save({ ...state, active });
    },

    reset: (state: State) => {
      state.active = [];
      save(state);
    },
  },
});

export const { load, toggleActive } = slice.actions;

export const initLyrics = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(load(await fetchYaml("/lyrics.yaml")));
  };
};

export function toggleSelection(key: string) {
  const [_lyrics, ...rest] = key.split("-").map(Number);
  return (dispatch: AppDispatch) => {
    dispatch(toggleActive(rest));
  };
}

export default slice.reducer;
