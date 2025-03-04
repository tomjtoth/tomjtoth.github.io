import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { tLux, tSpin } from "../../reducers";
import {
  useAppSelector,
  useAppDispatch,
  useModal,
  useSpinner,
} from "../../hooks";
import { processImports } from "../../services/luxor";

export function useInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modal = useModal();
  const { search, pathname } = useLocation();
  const loaded = useAppSelector((s) => s.luxor.loaded);
  useSpinner(loaded);

  useEffect(() => {
    if (!loaded) {
      const imps = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imps);

      if (prompt.length > 0) {
        dispatch(tSpin.hide());
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(tLux.init(arr));
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(tLux.init(arr));
        if (imps) navigate(pathname);
      }
    }
  }, []);
}
