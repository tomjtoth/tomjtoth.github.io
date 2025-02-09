import { useContext, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useLocation, useNavigate } from "react-router";

import { addField, rmField, addNum, init } from "../../reducers/luxor";
import { CxModal } from "../Modal";
import { Language, Text } from "../../types/modal";

import "./luxor.css";

import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export default function Luxor() {
  const { setModal } = useContext(CxModal)!;
  const dispatch = useAppDispatch();
  const { fields, pickedNums, locked } = useAppSelector((s) => s.luxor);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const preset = new URLSearchParams(search).get("preset");
    if (fields.length == 0) dispatch(init(preset));

    if (preset) navigate(pathname);
  }, []);

  return (
    <>
      <Header title="Luxor" icon="🪲">
        <ControlForm />
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
