import { useContext, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";

import { init, toggleSelection } from "../../reducers/lyrics";
import { CxLoader } from "../Loader";

import "./lyrics.css";

import Artists from "./Artists";
import Header from "../Header";
import MainView from "../MainView";

export default function Lyrics() {
  const loader = useContext(CxLoader);
  const dispatch = useAppDispatch();
  const { artists } = useAppSelector((s) => s.lyrics);

  const uninitialized = artists.length === 0;

  useEffect(() => {
    if (uninitialized) {
      dispatch(init());
      loader.show();
    } else loader.hide();
  }, [uninitialized]);

  return (
    <>
      <Header title="låttext" icon="🎶" />
      <MainView
        {...{
          onClick: ({ target }) => {
            const { id, classList } = target as HTMLElement;
            if (
              !classList.contains("missing-lyrics") &&
              classList.contains("clickable")
            ) {
              dispatch(toggleSelection(id));
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
        {!uninitialized && <Artists />}
      </MainView>
    </>
  );
}
