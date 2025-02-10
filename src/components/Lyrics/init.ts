import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { init } from "../../reducers/lyrics";
import { CxLoader } from "../Loader";

export default function useInit() {
  const dispatch = useAppDispatch();
  const { artists } = useAppSelector((s) => s.lyrics);
  const loaded = artists.length > 0;

  const loader = useContext(CxLoader);

  useEffect(() => {
    if (!loaded) {
      dispatch(init());
      loader.show();
    } else loader.hide();
  }, [loaded]);

  return loaded;
}
