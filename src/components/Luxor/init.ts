import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { spin, lux } from "../../reducers";
import { useAppSelector, useAppDispatch, useModal } from "../../hooks";
import { processImports } from "../../services/luxor";

export function useInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modal = useModal();
  const { search, pathname } = useLocation();
  const loaded = useAppSelector((s) => s.luxor.loaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(spin.show());

      const imps = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imps);

      if (prompt.length > 0) {
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(lux.init(arr)).then(() => dispatch(spin.hide()));
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(lux.init(arr)).then(() => dispatch(spin.hide()));
        if (imps) navigate(pathname);
      }
    }
  }, []);
}
