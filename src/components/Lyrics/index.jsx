import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { initLyrics, toggle_active } from "../../reducers/lyrics";

import "./lyrics.css";

import Artists from "./Artists";
import Header from "../Header";
import MainView from "../MainView";
import Loader from "../Loader";

export default function () {
  const dispatch = useDispatch();

  const { artists, active } = useSelector((s) => s.lyrics);
  const initialized = artists !== undefined;

  useEffect(() => {
    if (!initialized) {
      dispatch(initLyrics());
    }
  }, []);

  return (
    <>
      <Header title="låttext" icon="🎶" />

      <MainView
        {...{
          onClick: ({ target: { id, classList } }) => {
            if (!classList.contains("missing-lyrics")) {
              dispatch(toggle_active(id));
            }
          },
        }}
      >
        <p
          style={{
            margin: 16,
          }}
        >
          The below songs are linked to Google Translate (or YouTube, when the
          lyrics are still missing).
        </p>
        {initialized ? <Artists {...{ artists, active }} /> : <Loader />}
      </MainView>
    </>
  );
}
