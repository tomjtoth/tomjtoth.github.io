import "./lyrics.css";

import Artists from "./Artists";
import Header from "../Header";
import MainView from "../MainView";
import useInit from "../../hooks/lyrics/init";

export default function Lyrics() {
  useInit();
  return (
    <>
      <Header title="låttext" />
      <MainView>
        <p
          style={{
            margin: 16,
          }}
        >
          The below songs are linked to Google Translate (or YouTube, when the
          lyrics are still missing).
        </p>
        <Artists />
      </MainView>
    </>
  );
}
