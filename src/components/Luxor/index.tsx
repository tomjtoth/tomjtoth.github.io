import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector, useAppDispatch } from "../../hooks";
import { addField, rmField, addNum, init } from "../../reducers/luxor";
import { Language, Text } from "../../types/modal";
import { CxModal } from "../Modal";
import { processImports } from "../../services/luxor";

import "./luxor.css";

import Header from "../Header";
import MainView from "../MainView";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export default function Luxor() {
  const { setModal } = useContext(CxModal)!;
  const dispatch = useAppDispatch();
  const { fields, pickedNums, locked } = useAppSelector((s) => s.luxor);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Header title="Luxor" icon="🪲">
        <Controls />
      </Header>
      <MainView
        className="luxor"
        onClick={({ target }) => {
          const { tagName, textContent, classList, parentNode } =
            target as HTMLElement;
          if (classList.contains("luxor-fld-add")) {
            dispatch(addField((parentNode!.parentNode! as HTMLElement).id));
          } else if (classList.contains("luxor-fld-del")) {
            setModal({
              prompt: <>Azt a mezőt most törlöm...</>,
              lang: Language.Hu,
              buttons: [
                [
                  Text.Ok,
                  () =>
                    dispatch(
                      rmField((parentNode!.parentNode! as HTMLElement).id)
                    ),
                ],
                [Text.Cancel],
              ],
            });
          } else if (locked && tagName === "TD") {
            const asNumber = Number(textContent);
            const num = isNaN(asNumber) ? 0 : asNumber;
            if (!(pickedNums as number[]).includes(num)) dispatch(addNum(num));
          }
        }}
      >
        {fields && (
          <>
            <PickedNumsLine />
            <Fields />
          </>
        )}
      </MainView>
    </>
  );
}
