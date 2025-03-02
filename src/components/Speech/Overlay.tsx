import { useSpeech } from "../../hooks";

export function SpeechOverlay() {
  const ss = useSpeech();

  return ss?.speaking || ss?.paused ? (
    <div
      className={`fixed bottom-10 z-5 left-1/2 -translate-x-1/2
     bg-bg-0 border-2 rounded-3xl flex gap-3 p-4 *:clickable [&_span]:text-2xl`}
    >
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
