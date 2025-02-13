import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "..";

import { init } from "../../reducers/arx-fatalis";
import useSpinner from "../spinner";
import { CxModal } from "../modal";

export default function useInit() {
  const dispatch = useAppDispatch();
  const arx = useAppSelector((s) => s.arxFatalis);

  const spinner = useSpinner();
  const modal = useContext(CxModal)!;

  useEffect(() => {
    if (!arx) {
      dispatch(init());
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [arx]);

  return { arx, modal, dispatch };
}
