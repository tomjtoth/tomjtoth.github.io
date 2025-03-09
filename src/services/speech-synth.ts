import { db } from "../db";
import { SpeechSynthData } from "../types/speech-synth";

const id = "speech-synth";

export default {
  save: ({ voice, rate, pitch }: SpeechSynthData) => {
    db.misc.put({
      id,
      voice,
      rate,
      pitch,
    } as SpeechSynthData);
  },

  load: async () => {
    const {
      voice = 0,
      rate = 1,
      pitch = 1,
    } = ((await db.misc.get(id)) as SpeechSynthData) ?? {};

    return { voice, rate, pitch };
  },
};
