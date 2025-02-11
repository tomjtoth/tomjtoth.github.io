import { db } from "../db";
import { Conf } from "../types/battery-monitor";

const id = "battery-monitor";

export default {
  save: (conf: Conf) => {
    db.misc.put({ id, ...conf } as Conf);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    return stored ? (stored as Conf) : { lower: 20, upper: 80, allowed: false };
  },
};
