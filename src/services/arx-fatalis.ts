import { db } from "../db";
import { ArxFatalis } from "../types/db";
import { State } from "../types/arx-fatalis";
import { spells } from "../components/ArxFatalis/config";

const id = "arx-fatalis";

export function save(s: State) {
  db.misc.put({ id, castSpells: [...s.castSpells] } as ArxFatalis);
}

export async function load() {
  const stored = await db.misc.get(id);
  return stored ? (stored as ArxFatalis).castSpells : [];
}

export function spellValue(idx: number) {
  const { page, sequence } = spells[idx];
  return page * sequence.length;
}
