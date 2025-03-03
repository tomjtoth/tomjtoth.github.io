import { useAppDispatch, useAppSelector } from "../../hooks";
import { ss as ssr } from "../../reducers";
import { PlaybackState as PB } from "../../types";

import { CLASSES } from "./classes";

export function SpeechControls() {
  const dispatch = useAppDispatch();
  const ss = useAppSelector((s) => s.speechSynth);

  return ss.pbState !== PB.Stopped ? (
    <div className={CLASSES.join(" ")}>
      <span>🤖</span>
      <select
        className="max-w-30 md:max-w-70"
        onChange={(ev) => {
          const choice = Number(ev.target.value);
          dispatch(ssr.setVoice(choice));
        }}
        value={ss.voice}
      >
        {ss.selectables.map((v, i) => (
          <option key={i} value={i}>
            {v.lang}: {v.name.replace("Microsoft", "MS")}
          </option>
        ))}
      </select>
      {ss.pbState === PB.Paused ? (
        <span onClick={() => dispatch(ssr.resume())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(ssr.pause())}>⏸️</span>
      )}
      <span onClick={() => dispatch(ssr.stop())}>⏹️</span>
    </div>
  ) : null;
}
