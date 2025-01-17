import { StepsProps } from "../../types/shopping-list";

export default function Steps({ recId, steps, lang }: StepsProps) {
  return (
    <ol {...{ className: "slr-steps", lang }}>
      {steps.map((__html, i) => (
        <li key={`${recId}-${i}`} dangerouslySetInnerHTML={{ __html }} />
      ))}
    </ol>
  );
}
