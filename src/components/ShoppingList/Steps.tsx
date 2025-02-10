import { StepsProps } from "../../types/shopping-list";

export default function Steps({ steps, lang }: StepsProps) {
  return (
    <ol {...{ className: "slr-steps", lang }}>
      {steps.map((__html, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html }} />
      ))}
    </ol>
  );
}
