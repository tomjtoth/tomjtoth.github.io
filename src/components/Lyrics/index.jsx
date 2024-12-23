import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initLyrics,
  update_scroll,
  toggle_active,
} from "../../reducers/lyrics";
import "./lyrics.css";
import Artists from "./Artists";
import { header } from "../NavBar";

export default function () {
  const dispatch = useDispatch();

  const { artists, active, scrollPos } = useSelector((s) => s.lyrics);
  const initialized = Object.keys(artists).length > 0;

  useEffect(() => {
    if (!initialized) dispatch(initLyrics());
  }, []);

  useEffect(() => {
    if (initialized) window.scrollTo(0, scrollPos);
  }, []);

  return (
    <div
      onScroll={() => {
        dispatch(update_scroll());
      }}
      onClick={(e) => {
        if (e.target.tagName === "P") {
          console.log(e.target);
          dispatch(toggle_active(e.target.parentNode.getAttribute("keyAAS")));
          e.stopPropagation();
        }
      }}
    >
      {header("låttext")}
      <p>
        The below songs are linked to Google Translate (or YouTube, when the
        lyrics are still missing).
      </p>
      {initialized ? <Artists {...{ artists, active }} /> : <p>Loading...</p>}
    </div>
  );
}
