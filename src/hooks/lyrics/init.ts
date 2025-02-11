import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { init } from "../../reducers/lyrics";
import { CxSpinner } from "../../hooks/spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const { artists, active } = useAppSelector((s) => s.lyrics);
  const loaded = artists.length > 0;

  const spinner = useContext(CxSpinner)!;

  useEffect(() => {
    if (!loaded) {
      dispatch(init());
      spinner.show();
    } else spinner.hide();
  }, [loaded]);

  return { dispatch, artists, active };
}
