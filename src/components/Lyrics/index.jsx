import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initLyrics } from "../../reducers/lyrics";
import "./lyrics.css";
import Artists from "./Artists";

export default function () {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initLyrics());
  }, []);

  const lyrics = useSelector(({ lyrics }) => lyrics);

  return (
    <>
      <h2>Lyrics</h2>
      <p>
        The below songs are linked to Google Translate (or YouTube, when the
        lyrics are still missing).
      </p>
      <Artists data={lyrics} />
    </>
  );
}
