import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector, useAppDispatch } from "../../hooks";
import useSpinner from "../spinner";
import { processImports } from "../../services/luxor";
import { init } from "../../reducers/luxor";
import { CxModal } from "../modal";

export default function useInit() {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const dispatch = useAppDispatch();
  const { fields, pickedNums } = useAppSelector((s) => s.luxor);
  const modal = useContext(CxModal)!;

  const spinner = useSpinner();

  const loaded = fields.length > 0;

  useEffect(() => {
    if (!loaded) {
      spinner.show();

      const imp = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imp);

      if (prompt) {
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(init(arr));
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(init(arr));
        if (imp) navigate(pathname);
      }
    } else spinner.hide();
  }, [loaded]);

  return { dispatch, modal, fields, pickedNums };
}
