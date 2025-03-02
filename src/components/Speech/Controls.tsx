import { useSpeech } from "../../hooks";

export function SpeechControls() {
  const ss = useSpeech();

  const classes = [
    // everywhere
    "flex gap-3 *:clickable [&_span]:text-2xl",

    // on mobile
    "p-4 fixed bottom-10 z-5 left-1/2 -translate-x-1/2 bg-bg-0",
    "border-2 rounded-3xl",

    // in Controls
    "sm:py-0 sm:pl-0 sm:relative sm:bottom-0 sm:z-0 sm:left-0 sm:translate-none sm:bg-inherit",
    "sm:border-none sm:rounded-none",
  ];

  return ss?.speaking || ss?.paused ? (
    <div className={classes.join(" ")}>
      <span onClick={ss.toggle}>{ss.paused ? "▶️" : "⏸️"}</span>
      <select
        className="max-w-30"
        onChange={ss.selector.onChange}
        value={ss.selector.choice}
      >
        {ss.selector.voices.map((v, i) => (
          <option key={i} value={i}>
            {v.name.replace("Microsoft", "MS")} ({v.lang})
          </option>
        ))}
      </select>
      <span onClick={ss.stop}>⏹️</span>
    </div>
  ) : null;
}
