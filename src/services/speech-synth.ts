import { db } from "../db";
import { SpeechSynthData } from "../types/db";

const id = "speech-synth";

export default {
  save: (voice: number) => {
    db.misc.put({
      id,
      voice,
    } as SpeechSynthData);
  },

  load: async () => {
    const stored = await db.misc.get(id);
    if (stored) {
      const s = stored as SpeechSynthData;
      return { voice: s.voice };
    }

    return { choice: 0 };
  },
};
