import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "..";

import { init } from "../../reducers/arx-fatalis";
import { CxModal } from "../modal";
import { hideSpinner, showSpinner } from "../../reducers/spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const arx = useAppSelector((s) => s.arxFatalis);

  const modal = useContext(CxModal)!;

  useEffect(() => {
    if (arx === null) {
      dispatch(showSpinner());
      dispatch(init()).then(() => dispatch(hideSpinner()));
    }
  }, []);

  return { arx, modal, dispatch: dispatch };
}
