import { StepsProps } from "../../types/shopping-list";

export default function Steps({ steps, lang }: StepsProps) {
  return (
    <ol
      {...{
        className:
          "bg-bg-0 max-h-0 duration-200 ease-in-out overflow-hidden pl-1 cursor-help",
        lang,
      }}
    >
      {steps.map((__html, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html }} />
      ))}
    </ol>
  );
}
