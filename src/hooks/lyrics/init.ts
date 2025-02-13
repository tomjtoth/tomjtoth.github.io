import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { init } from "../../reducers/lyrics";
import useSpinner from "../../hooks/spinner";

export default function useInit() {
  const spinner = useSpinner();
  const dispatch = useAppDispatch();
  const { artists, active } = useAppSelector((s) => s.lyrics);

  const loaded = artists.length > 0;

  useEffect(() => {
    if (!loaded) {
      dispatch(init());
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [loaded]);

  return { dispatch, artists, active };
}
