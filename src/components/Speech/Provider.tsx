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
  selector: {
    voices: SpeechSynthesisVoice[];
    onChange: ChangeEventHandler;
  };
};

export const CxSpeech = createContext<TCxSpeech | null>(null);

const synth = window.speechSynthesis;

export function SpeechProvider({ children }: PropsWithChildren) {
  const [choice, setChoice] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  function loadVoices() {
    setVoices(synth.getVoices());
    console.debug("synth voices loaded");
  }

  useEffect(() => {
    // in Google Chrome the voices are not ready on page load
    if ("onvoiceschanged" in synth) {
      synth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  return (
    <CxSpeech.Provider
      value={{
        selector: {
          voices,
          onChange: (ev: ChangeEvent<HTMLSelectElement>) => {
            setChoice(Number(ev.target.value));
          },
        },

        speak: (text: string) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = voices[choice];
          window.speechSynthesis.speak(utterance);
        },
      }}
    >
      {children}
    </CxSpeech.Provider>
  );
}
