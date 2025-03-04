import { QuotesControls } from "./Quotes";
import { SpeechControls } from "./Speech";

export function MediaControls() {
  const speech = SpeechControls();
  const quotes = QuotesControls();
  return speech ?? quotes;
}
