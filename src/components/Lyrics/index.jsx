import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initLyrics } from "../../reducers/lyrics";
import "./lyrics.css";
import Artists from "./Artists";
import { header } from "../NavBar";

export default function () {
  const dispatch = useDispatch();

  const lyrics = useSelector(({ lyrics }) => lyrics);
  const uninitialized = Object.keys(lyrics).length === 0;

  useEffect(() => {
    if (uninitialized) dispatch(initLyrics());
  }, []);

  return (
    <>
      {header("låttext")}
      <p>
        The below songs are linked to Google Translate (or YouTube, when the
        lyrics are still missing).
      </p>
      {uninitialized ? <p>Loading...</p> : <Artists data={lyrics} />}
    </>
  );
}
