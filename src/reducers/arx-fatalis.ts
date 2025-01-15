import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { save, load, spellValue } from "../services/arx-fatalis";
import { State } from "../types/arx-fatalis";

type RState = State | null;

const slice = createSlice({
  name: "arx-fatalis",
  initialState: null as RState,
  reducers: {
    init: (_, { payload }) => payload,

    addSpell: (state, { payload }: PayloadAction<number>) => {
      state!.castSpells.push(payload);
      state!.score += spellValue(payload);
      save(state!);
    },
  },
});

const { init, addSpell } = slice.actions;

export const castSpell = (spell: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(addSpell(spell));
  };
};

export function initArxFatalis() {
  return (dispatch: AppDispatch) => {
    load().then((castSpells) =>
      dispatch(
        init({
          castSpells,
          score: castSpells.reduce(
            (sum: number, spellIdx) => sum + spellValue(spellIdx),
            0
          ),
        })
      )
    );
  };
}

export default slice.reducer;
