import { useSpeech } from "../../hooks";

export function VoiceSelector() {
  const sel = useSpeech().selector;

  return (
    <>
      🤖
      <select {...{ onChange: sel.onChange }}>
        {sel.voices.map((v, i) => (
          <option value={i}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
    </>
  );
}
