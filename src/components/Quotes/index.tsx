import ViewHeader from "../ViewHeader";
import ViewContent from "../ViewContent";

import "./quotes.css";

export default function Quotes() {
  return (
    <>
      <ViewHeader title=""></ViewHeader>
      <ViewContent className="quotes">
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
