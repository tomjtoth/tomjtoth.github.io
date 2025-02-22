import { ViewHeader, ViewContent } from "..";

export function Quotes() {
  return (
    <>
      <ViewHeader title=""></ViewHeader>
      <ViewContent className="p-4">
        <p>
          <a href="https://goodreads.com/tomjtoth">Tässä</a> on lista miun
          lukemista (kuuntelemista) kirjoista.
        </p>
        <ul>
          {/* TODO: 238wpm for the average adult, calc reading times during initialization */}
          {[].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </ViewContent>
    </>
  );
}
