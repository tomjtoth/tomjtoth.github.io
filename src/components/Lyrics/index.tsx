import { ViewHeader, ViewContent } from "..";
import { useSpinner, useAppSelector } from "../../hooks";

import Artists from "./Artists";

export function Lyrics() {
  const loaded = useAppSelector((s) => s.lyrics.artists.length > 0);
  useSpinner(loaded);

  return (
    <>
      <ViewHeader title="låttext" />
      <ViewContent>
        <p className="m-4">
          The below songs are linked to Google Translate (or YouTube, when the
          lyrics are still missing).
        </p>
        <Artists />
      </ViewContent>
    </>
  );
}
