import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import db, { spellValue } from "../services/arx-fatalis";
import { State } from "../types/arx-fatalis";

const slice = createSlice({
  name: "arx-fatalis",
  initialState: null as State | null,
  reducers: {
    init: (_, { payload }) => payload,

    addSpell: (state, { payload }: PayloadAction<number>) => {
      state!.castSpells.push(payload);
      state!.score += spellValue(payload);
      db.save(state!);
    },
  },
});

const act = slice.actions;

export function castSpell(spell: number) {
  return (dispatch: AppDispatch) => dispatch(act.addSpell(spell));
}

export function init() {
  return (dispatch: AppDispatch) =>
    db.load().then((castSpells) =>
      dispatch(
        act.init({
          castSpells,
          score: castSpells.reduce(
            (sum: number, spellIdx) => sum + spellValue(spellIdx),
            0
          ),
        })
      )
    );
}

export default slice.reducer;
