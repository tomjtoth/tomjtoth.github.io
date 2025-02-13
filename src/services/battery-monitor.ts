import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { BatMonConf } from "../types/battery-monitor";

const id = "battery-monitor";

export default {
  save: (conf: BatMonConf) => {
    const cc = isDraft(conf) ? current(conf) : conf;
    console.debug("storing batMonConf:", cc);
    db.misc.put(cc);
  },

  load: async () => {
    const stored = await db.misc.get(id);

    return (
      stored ? stored : { id, lower: 20, upper: 80, allowed: false }
    ) as BatMonConf;
  },
};
