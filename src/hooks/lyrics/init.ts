import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { init } from "../../reducers/lyrics";
import useSpinner from "../../hooks/spinner";

export default function useInit() {
  const spinner = useSpinner();
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.lyrics.artists.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(init());
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [loaded]);
}
