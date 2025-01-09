import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";
import { spells } from "../components/ArxFatalis/config";
import { AppDispatch } from "../store";

type State = {
  score: number;
  castSpells: string[];
};

function save({ score, ...state }: State) {
  storeObject(name, state);
}

function spellValue(spell: string) {
  const { page, sequence } = spells.find((s) => s.spell === spell)!;
  return page * sequence.length;
}

const name = "arx-fatalis";

const { castSpells } = loadObject(name, { castSpells: [] });

const slice = createSlice({
  name,
  initialState: {
    castSpells,
    score: castSpells.reduce(
      (sum: number, spell: string) => sum + spellValue(spell),
      0
    ),
  },
  reducers: {
    addSpell: (state: State, { payload }: PayloadAction<string>) => {
      state.castSpells.push(payload);
      state.score += spellValue(payload);
      save(state);
    },
  },
});

const { addSpell } = slice.actions;

export const castSpell = (spell: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(addSpell(spell));
  };
};

export default slice.reducer;
