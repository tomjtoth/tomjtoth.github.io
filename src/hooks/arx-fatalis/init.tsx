import { useEffect, useContext } from "react";
import { useAppDispatch, useAppSelector } from "..";

import { init } from "../../reducers/arx-fatalis";
import { CxModal } from "../modal";
import { CxSpinner } from "../spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const arx = useAppSelector((s) => s.arxFatalis);

  const spinner = useContext(CxSpinner)!;
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
