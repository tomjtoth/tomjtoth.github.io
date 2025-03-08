import { createContext, useContext } from "react";

import { QuotesControls } from "./Quotes";
import { SpeechControls } from "./Speech";

export const CxMediaControlsPadding = createContext<boolean>(true);

export function MediaControls() {
  const speech = SpeechControls();
  const quotes = QuotesControls();
  const rendered = speech !== null || quotes !== null;

  const needsPadding = useContext(CxMediaControlsPadding);

  const padding = rendered && needsPadding ? <div className="grow" /> : null;

  return (
    <>
      {padding}
      {speech ?? quotes}
    </>
  );
}
