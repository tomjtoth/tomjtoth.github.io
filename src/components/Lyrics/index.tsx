import useInit from "./init";

import "./lyrics.css";

import Artists from "./Artists";
import Header from "../Header";
import MainView from "../MainView";

export default function Lyrics() {
  const loaded = useInit();

  return (
    <>
      <Header title="låttext" icon="🎶" />
      <MainView>
        <p
          style={{
            margin: 16,
          }}
        >
          The below songs are linked to Google Translate (or YouTube, when the
          lyrics are still missing).
        </p>
        {loaded && <Artists />}
      </MainView>
    </>
  );
}
