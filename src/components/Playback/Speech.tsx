import { useAppDispatch, useAppSelector } from "../../hooks";
import { tSS } from "../../reducers";
import { PlaybackState as PB } from "../../types";

import { CLASSES } from "./classes";

export function SpeechControls() {
  const dispatch = useAppDispatch();
  const ss = useAppSelector((s) => s.speechSynth);

  return ss.pbState === PB.Stopped ? null : (
    <div className={CLASSES.join(" ")}>
      <span>🤖</span>
      <select
        className="max-w-30 md:max-w-70"
        onChange={(ev) => {
          const choice = Number(ev.target.value);
          dispatch(tSS.setVoice(choice));
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
        <span onClick={() => dispatch(tSS.resume())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(tSS.pause())}>⏸️</span>
      )}
      <span onClick={() => dispatch(tSS.stop())}>⏹️</span>
    </div>
  );
}
