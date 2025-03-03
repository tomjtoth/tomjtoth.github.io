import { useAppDispatch, useAppSelector } from "../../hooks";
import { qts } from "../../reducers";
import { PlaybackState as PB } from "../../types";

import { CLASSES } from "./classes";

export function QuotesControls() {
  const dispatch = useAppDispatch();
  const qt = useAppSelector((s) => s.quotes);

  return qt.pbState !== PB.Stopped ? (
    <div className={CLASSES.join(" ")}>
      <span>🗣️</span>
      {qt.pbState === PB.Paused ? (
        <span onClick={() => dispatch(qts.play())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(qts.pause())}>⏸️</span>
      )}
      <span onClick={() => dispatch(qts.stop())}>⏹️</span>
    </div>
  ) : null;
}
