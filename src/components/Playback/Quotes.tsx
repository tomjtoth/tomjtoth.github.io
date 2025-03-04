import { useAppDispatch, useAppSelector } from "../../hooks";
import { tQt } from "../../reducers";
import { PlaybackState as PB } from "../../types";

import { CLASSES } from "./classes";

export function QuotesControls() {
  const dispatch = useAppDispatch();
  const qt = useAppSelector((s) => s.quotes);

  return qt.pbState !== PB.Stopped ? (
    <div className={CLASSES.join(" ")}>
      <span>🗣️</span>
      {qt.pbState === PB.Paused ? (
        <span onClick={() => dispatch(tQt.play())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(tQt.pause())}>⏸️</span>
      )}
      <span onClick={() => dispatch(tQt.stop())}>⏹️</span>
    </div>
  ) : null;
}
