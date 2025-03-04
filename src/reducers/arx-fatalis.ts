import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import db from "../services/arx-fatalis";
import { SpellEnum, Spell, State } from "../types/arx-fatalis";

const slice = createSlice({
  name: "arx-fatalis",
  initialState: {
    loaded: false,
    score: 0,
    castSpells: [],
  } as State,
  reducers: {
    init: (_, { payload }) => payload,

    addSpell: (state, { payload }: PayloadAction<SpellEnum>) => {
      state.castSpells.push(payload);
      state.score += Spell.pointsOf(payload);
      db.save(state);
    },
  },
});

const sa = slice.actions;

/**
 * # Thunks of Arx Fatalis
 */

export const tArx = {
  cast: (spell: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.addSpell(spell));
  },

  init: () => {
    return (dispatch: AppDispatch) =>
      db.load().then((castSpells) => {
        dispatch(
          sa.init({
            loaded: true,
            castSpells,
            score: castSpells.reduce(
              (sum: number, se: SpellEnum) => sum + Spell.pointsOf(se),
              0
            ),
          })
        );
      });
  },
};

export default slice.reducer;
