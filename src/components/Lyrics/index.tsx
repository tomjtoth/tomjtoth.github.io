import { useEffect } from "react";

import { ViewHeader, ViewContent } from "..";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { spin, lyr } from "../../reducers";

import Artists from "./Artists";

export function Lyrics() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.lyrics.artists.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(spin.show());
      dispatch(lyr.init()).then(() => dispatch(spin.hide()));
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
