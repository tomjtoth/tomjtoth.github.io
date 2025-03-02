import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { QuotesData } from "../types/db";

const id = "quotes";

export default {
  save: ({ active, wpm }: QuotesData) => {
    db.misc.put({
      id,
      active: isDraft(active) ? current(active) : active,
      wpm,
    } as QuotesData);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    if (stored) {
      const s = stored as QuotesData;
      return { wpm: s.wpm, active: s.active };
    }

    return { wpm: 238, active: [] };
  },
};
