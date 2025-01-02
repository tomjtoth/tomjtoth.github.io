import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";
import { spells } from "../components/Runes/config";

function save({ points, ...state }) {
  storeObject(name, state);
  return { points, ...state };
}

function spellValue(spell) {
  const { page, sequence } = spells[spell];
  return page * sequence.length;
}

const name = "runes";

const { castSpells } = loadObject(name, { castSpells: [] });

const slice = createSlice({
  name,
  initialState: {
    castSpells,
    score: castSpells.reduce((sum, spell) => sum + spellValue(spell), 0),
  },
  reducers: {
    addSpell: ({ castSpells, score }, { payload }) => {
      const next = {
        castSpells: castSpells.concat(payload),
        score: score + spellValue(payload),
      };
      return save(next);
    },
  },
});

const { addSpell } = slice.actions;

export const castSpell = (spell) => {
  return (dispatch) => {
    dispatch(addSpell(spell));
  };
};

export default slice.reducer;
