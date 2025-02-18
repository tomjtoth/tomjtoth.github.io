import "./lyrics.css";

import Artists from "./Artists";
import ViewHeader from "../ViewHeader";
import ViewContent from "../ViewContent";
import useInit from "../../hooks/lyrics/init";

export default function Lyrics() {
  useInit();
  return (
    <>
      <ViewHeader title="låttext" />
      <ViewContent>
        <p
          style={{
            margin: 16,
          }}
        >
          The below songs are linked to Google Translate (or YouTube, when the
          lyrics are still missing).
        </p>
        <Artists />
      </ViewContent>
    </>
  );
}
