import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";
import { spells } from "../components/ArxFatalis/config";
import { AppDispatch } from "../store";

type State = {
  score: number;
  castSpells: number[];
};

function save({ score, ...state }: State) {
  storeObject(name, state);
}

function spellValue(idx: number) {
  const { page, sequence } = spells[idx];
  return page * sequence.length;
}

const name = "arx-fatalis";

const { castSpells } = loadObject(name, { castSpells: [] });

const slice = createSlice({
  name,
  initialState: {
    castSpells,
    score: castSpells.reduce((sum: number, _, idx) => sum + spellValue(idx), 0),
  },
  reducers: {
    addSpell: (state: State, { payload }: PayloadAction<number>) => {
      state.castSpells.push(payload);
      state.score += spellValue(payload);
      save(state);
    },
  },
});

const { addSpell } = slice.actions;

export const castSpell = (spell: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(addSpell(spell));
  };
};

export default slice.reducer;
