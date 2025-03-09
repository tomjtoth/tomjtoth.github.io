export type SpeechSynthData = { voice: number; rate: number; pitch: number };

type SpeakProps = {
  text: string;
  onEnd: CallableFunction;
  onProgress: CallableFunction;
};

const SYNTH = window.speechSynthesis;
const PARAGRAPHS = /.+(?=\n|$)/gm;

export class SpeechManager {
  rate: number | undefined;
  pitch: number | undefined;
  voice: number | undefined;
  voices;

  paragraphs = [] as string[];
  len: number | undefined;
  onProgress: CallableFunction | undefined;
  onEnd: CallableFunction | undefined;

  constructor() {
    this.voices = SYNTH.getVoices().toSorted((a, b) => {
      const lower_a = a.lang.toLowerCase();
      const lower_b = b.lang.toLowerCase();
      if (lower_a < lower_b) return -1;
      if (lower_a > lower_b) return 1;
      return 0;
    });
  }

  getSelection() {
    return this.voices.map((x) => ({
      name: x.name.replace("Microsoft", "MS"),
      lang: x.lang,
    }));
  }

  speak({ text, onEnd, onProgress }: SpeakProps) {
    this.paragraphs = [...text.matchAll(PARAGRAPHS)].map((x) => x[0]);
    this.len = this.paragraphs.length;
    this.onEnd = onEnd;
    this.onProgress = onProgress;

    SYNTH.cancel();
    this.readNextSentence();
  }

  readNextSentence() {
    const [part] = this.paragraphs.splice(0, 1);
    const utterance = new SpeechSynthesisUtterance(part);

    utterance.onend = () => {
      if (this.paragraphs.length > 0) {
        this.readNextSentence();
        this.onProgress!((this.len! - this.paragraphs.length) / this.len!);
      } else if (!SYNTH.pending) {
        this.onEnd!();
      }
    };

    utterance.voice = this.voices[this.voice!];
    utterance.rate = this.rate!;
    utterance.pitch = this.pitch!;

    SYNTH.speak(utterance);
  }

  pause() {
    SYNTH.pause();
  }

  resume() {
    SYNTH.resume();
  }

  stop() {
    this.paragraphs = [];
    SYNTH.cancel();
  }
}
