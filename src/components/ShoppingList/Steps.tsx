import { StepsProps } from "../../types/shopping-list";

export default function Steps({ recId, steps, lang }: StepsProps) {
  return (
    <ol {...{ className: "recipe-steps", lang }}>
      {steps.map((__html: string, i) => {
        const key = `${recId}-${i}`;

        return <li key={key} dangerouslySetInnerHTML={{ __html }} />;
      })}
    </ol>
  );
}
