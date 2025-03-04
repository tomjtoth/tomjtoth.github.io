import { useEffect } from "react";

import { tSpin } from "../reducers";
import { useAppDispatch, useAppSelector } from ".";

export function useSpinner(loaded: boolean) {
  const spinnerActive = useAppSelector((s) => s.spinner.visible);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loaded) {
      dispatch(tSpin.show());
    } else {
      if (spinnerActive) dispatch(tSpin.hide());
    }
  }, [loaded]);
}
