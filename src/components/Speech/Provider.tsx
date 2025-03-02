import {
  ChangeEvent,
  ChangeEventHandler,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { SpeechOverlay } from ".";

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

  function loadVoices() {
    const arr = synth.getVoices();
    console.debug("synth voices loaded", arr);

    setVoices(arr);
  }

  useEffect(() => {
    if (isSupported) {
      // in Google Chrome the voices are not ready on page load
      // if ("onvoiceschanged" in synth) {
      //   synth.onvoiceschanged = loadVoices;
      // } else {
      loadVoices();
      // }
    }
  }, []);

  return (
    <CxSpeech.Provider
      value={
        isSupported //&& voices.length > 0
          ? {
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
          : null
      }
    >
      {children}
      <SpeechOverlay />
    </CxSpeech.Provider>
  );
}
