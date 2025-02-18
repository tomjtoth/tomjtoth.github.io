import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { init } from "../../reducers/lyrics";
import { hideSpinner, showSpinner } from "../../reducers/spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.lyrics.artists.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());
      dispatch(init()).then(() => dispatch(hideSpinner()));
    }
  }, []);
}
