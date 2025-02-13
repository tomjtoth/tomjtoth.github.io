import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "..";

import { init } from "../../reducers/arx-fatalis";
import useSpinner from "../spinner";
import { CxModal } from "../modal";

export default function useInit() {
  const dispatch = useAppDispatch();
  const arx = useAppSelector((s) => s.arxFatalis);
  const loaded = arx != null;

  const spinner = useSpinner();
  const modal = useContext(CxModal)!;

  useEffect(() => {
    if (!loaded) {
      dispatch(init());
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [loaded]);

  return { arx, modal, dispatch };
}
