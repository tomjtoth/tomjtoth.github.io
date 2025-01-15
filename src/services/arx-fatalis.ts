import { current } from "@reduxjs/toolkit";
import { db } from "../db";
import { ArxFatalisSpells } from "../types/db";
import { spells } from "../components/ArxFatalis/config";

const id = "arx-fatalis";

export default {
  save: ({ castSpells }: ArxFatalisSpells) => {
    db.misc.put({ id, castSpells: current(castSpells) } as ArxFatalisSpells);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    return stored ? (stored as ArxFatalisSpells).castSpells : [];
  },
};

export function spellValue(idx: number) {
  const { page, sequence } = spells[idx];
  return page * sequence.length;
}
