import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import db from "../services/arx-fatalis";
import { State } from "../types/arx-fatalis";
import { SE, Spell } from "../types/arx-fatalis/spells";

const slice = createSlice({
  name: "arx-fatalis",
  initialState: null as State | null,
  reducers: {
    init: (_, { payload }) => payload,

    addSpell: (state, { payload }: PayloadAction<SE>) => {
      state!.castSpells.push(payload);
      state!.score += Spell.pointsOf(payload);
      db.save(state!);
    },
  },
});

const sa = slice.actions;

export function castSpell(spell: number) {
  return (dispatch: AppDispatch) => dispatch(sa.addSpell(spell));
}

export function init() {
  return (dispatch: AppDispatch) =>
    db.load().then((castSpells) => {
      // Spell.init();
      dispatch(
        sa.init({
          castSpells,
          score: castSpells.reduce(
            (sum: number, se: SE) => sum + Spell.pointsOf(se),
            0
          ),
        })
      );
    });
}

export default slice.reducer;
