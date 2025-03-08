import { useAppDispatch, useAppSelector } from "../../hooks";
import { tQt } from "../../reducers";
import { PlaybackState as PB } from "../../types";
import { secToMMSS } from "../../utils";

import { CLASSES } from "./classes";

export function QuotesControls() {
  const dispatch = useAppDispatch();
  const qt = useAppSelector((s) => s.quotes);

  return qt.playback.state === PB.Stopped ? null : (
    <div className={CLASSES.join(" ")}>
      <span>🗣️</span>
      {qt.playback.state === PB.Paused ? (
        <span onClick={() => dispatch(tQt.play())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(tQt.pause())}>⏸️</span>
      )}
      <div className="flex flex-col items-center">
        <input
          type="range"
          className="max-w-20 sm:max-w-fit clickable"
          min={0}
          max={qt.playback.duration}
          value={qt.playback.currentTime}
          onChange={(ev) => dispatch(tQt.seek(ev.target.value))}
        />

        <sub className="text-xs text-center">
          {secToMMSS(qt.playback.currentTime)}
        </sub>
      </div>

      <span onClick={() => dispatch(tQt.stop())}>⏹️</span>
    </div>
  );
}
