import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { QuotesActive } from "../types/db";

const id = "quotes";

export default {
  save: ({ active }: QuotesActive) => {
    db.misc.put({
      id,
      active: isDraft(active) ? current(active) : active,
    } as QuotesActive);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    return stored ? (stored as QuotesActive).active : [];
  },
};
