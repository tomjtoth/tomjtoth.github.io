import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector, useAppDispatch } from "../../hooks";
import { Language, Text } from "../../types/modal";
import { CxModal } from "../Modal";
import { CxSpinner } from "../Spinner";
import { processImports } from "../../services/luxor";
import { init } from "../../reducers/luxor";

export default function useInit() {
  const { setModal } = useContext(CxModal)!;
  const spinner = useContext(CxSpinner);

  const dispatch = useAppDispatch();
  const { fields } = useAppSelector((s) => s.luxor);

  const uninitialized = fields.length === 0;
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    if (uninitialized) {
      spinner.show();

      const imp = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imp);

      if (prompt) {
        setModal({
          prompt,
          lang: Language.Hu,
          buttons: [
            [
              Text.Ok,
              () => {
                if (!critical) {
                  dispatch(init(arr));
                  navigate(pathname);
                }
              },
            ],
          ],
        });
      } else {
        dispatch(init(arr));
        if (imp) navigate(pathname);
      }
    } else spinner.hide();
  }, [uninitialized]);
}
