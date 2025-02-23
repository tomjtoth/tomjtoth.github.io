import { useEffect } from "react";

import Artists from "./Artists";
import { ViewHeader, ViewContent } from "..";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { init } from "../../reducers/lyrics";

export function Lyrics() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.lyrics.artists.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());
      dispatch(init()).then(() => dispatch(hideSpinner()));
    }
  }, []);

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
