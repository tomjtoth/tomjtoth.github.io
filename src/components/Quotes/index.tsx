import Header from "../Header";
import MainView from "../MainView";

import "./quotes.css";

export default function Quotes() {
  return (
    <>
      <Header title=""></Header>
      <MainView className="quotes">
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
      </MainView>
    </>
  );
}
