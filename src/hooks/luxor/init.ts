import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector, useAppDispatch } from "..";
import useSpinner from "../spinner";
import { processImports } from "../../services/luxor";
import { init } from "../../reducers/luxor";
import { CxModal } from "../modal";

export default function useInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modal = useContext(CxModal)!;
  const spinner = useSpinner();
  const { search, pathname } = useLocation();
  const loaded = useAppSelector((s) => s.luxor.fields.length > 0);

  useEffect(() => {
    if (!loaded) {
      spinner.show();

      const imps = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imps);

      if (prompt) {
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(init(arr)).then(spinner.hide);
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(init(arr)).then(spinner.hide);
        if (imps) navigate(pathname);
      }
    }
  }, []);
}
