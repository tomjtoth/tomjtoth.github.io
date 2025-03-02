import { db } from "../db";
import { SpeechSynthData } from "../types/db";

const id = "speech-synth";

export default {
  save: (choice: number) => {
    db.misc.put({
      id,
      choice,
    } as SpeechSynthData);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    if (stored) {
      const s = stored as SpeechSynthData;
      return { choice: s.choice };
    }

    return { choice: 0 };
  },
};
