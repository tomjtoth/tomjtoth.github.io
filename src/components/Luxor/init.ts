import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { useAppSelector, useAppDispatch, useModal } from "../../hooks";
import { processImports } from "../../services/luxor";
import { initLuxor } from "../../reducers/luxor";

export function useInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modal = useModal();
  const { search, pathname } = useLocation();
  const loaded = useAppSelector((s) => s.luxor.loaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());

      const imps = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imps);

      if (prompt.length > 0) {
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(initLuxor(arr)).then(() => dispatch(hideSpinner()));
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(initLuxor(arr)).then(() => dispatch(hideSpinner()));
        if (imps) navigate(pathname);
      }
    }
  }, []);
}
