import {
  ChangeEvent,
  ChangeEventHandler,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type TCxSpeech = {
  speak: CallableFunction;
  speaking: boolean;
  paused: boolean;
  stop: () => void;
  toggle: () => void;
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
      const arr = synth.getVoices();
      console.debug("synth voices loaded", arr);
      arr.sort((a, b) => {
        const lower_a = a.name.toLowerCase();
        const lower_b = b.name.toLowerCase();
        if (lower_a < lower_b) return -1;
        if (lower_a > lower_b) return 1;
        return 0;
      });

      setVoices(arr);
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
              toggle: () => (!paused ? synth.pause() : synth.resume()),
              stop: () => {
                setSpeaking(false);
                setPaused(false);
                synth.cancel();
              },

              selector: {
                choice,
                voices,
                onChange: (ev: ChangeEvent<HTMLSelectElement>) => {
                  setChoice(Number(ev.target.value));
                },
              },

              speak: (text: string) => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = voices[choice];

                utterance.onend = () => setSpeaking(false);
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
