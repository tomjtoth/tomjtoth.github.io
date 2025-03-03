import { useAppDispatch, useAppSelector } from "../../hooks";
import { ss as ssr } from "../../reducers";
import { PlaybackState as PBS } from "../../types";

export const CLASSES = [
  // everywhere
  "flex items-center gap-3 *:clickable [&_span]:text-2xl",

  // on mobile
  "p-4 fixed bottom-10 z-5 left-1/2 -translate-x-1/2 bg-bg-0",
  "border-2 rounded-3xl",

  // in Controls
  "sm:py-0 sm:pl-0 sm:relative sm:bottom-0 sm:z-0 sm:left-0 sm:translate-none sm:bg-inherit",
  "sm:border-none sm:rounded-none",
];

export function MediaControls() {
  const dispatch = useAppDispatch();
  const ss = useAppSelector((s) => s.speechSynth);

  return ss.pbState !== PBS.Stopped ? (
    <div className={CLASSES.join(" ")}>
      {ss.pbState === PBS.Paused ? (
        <span onClick={() => dispatch(ssr.resume())}>▶️</span>
      ) : (
        <span onClick={() => dispatch(ssr.pause())}>⏸️</span>
      )}
      🤖
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
      <span onClick={() => dispatch(ssr.stop())}>⏹️</span>
    </div>
  ) : null;
}
