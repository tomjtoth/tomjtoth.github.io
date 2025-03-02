import {
  ChangeEvent,
  ChangeEventHandler,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import db from "../../services/speech-synth";

type TCxSpeech = {
  speak: CallableFunction;
  speaking: boolean;
  paused: boolean;

  stop: () => void;
  pause: () => void;
  resume: () => void;
  selector: {
    choice: number;
    voices: SpeechSynthesisVoice[];
    onChange: ChangeEventHandler;
  };
};

export const CxSpeech = createContext<TCxSpeech | null>(null);

const isSupported = "speechSynthesis" in window;
const synth = window.speechSynthesis;

export function SpeechProvider({ children }: PropsWithChildren) {
  const [choice, setChoice] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (isSupported) {
      Promise.all([synth.getVoices(), db.load()]).then(([arr, { choice }]) => {
        console.debug("synth voices loaded", arr);
        arr.sort((a, b) => {
          const lower_a = a.name.toLowerCase();
          const lower_b = b.name.toLowerCase();
          if (lower_a < lower_b) return -1;
          if (lower_a > lower_b) return 1;
          return 0;
        });

        setVoices(arr);
        setChoice(choice);
      });
    }
  }, []);

  return (
    <CxSpeech.Provider
      value={
        !isSupported //&& voices.length > 0
          ? null
          : {
              speaking,
              paused,

              resume: () => synth.resume(),
              pause: () => synth.pause(),
              stop: () => {
                setSpeaking(false);
                setPaused(false);
                synth.cancel();
              },

              selector: {
                choice,
                voices,
                onChange: (ev: ChangeEvent<HTMLSelectElement>) => {
                  const choice = Number(ev.target.value);
                  setChoice(choice);
                  db.save(choice);
                },
              },

              speak: (text: string) => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = voices[choice];

                utterance.onend = () => {
                  if (!synth.pending) {
                    setSpeaking(false);
                    setPaused(false);
                  }
                };
                utterance.onpause = () => setPaused(true);
                utterance.onresume = () => setPaused(false);

                synth.cancel();
                synth.speak(utterance);
                setSpeaking(true);
                setPaused(false);
              },
            }
      }
    >
      {children}
    </CxSpeech.Provider>
  );
}
