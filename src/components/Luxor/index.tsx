import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useLocation, useNavigate } from "react-router";

import {
  createNewField,
  removeField,
  newNumber,
  initLuxor,
} from "../../reducers/luxor";
import { ModalType } from "../../types/modal";

import "./luxor.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export default function Luxor() {
  const [modal, setModal] = useState<ModalType>();

  const dispatch = useAppDispatch();
  const { fields, pickedNums, locked } = useAppSelector((s) => s.luxor);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const preset = new URLSearchParams(search).get("preset");
    if (!fields) dispatch(initLuxor(preset));

    if (preset) navigate(pathname);
  }, []);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="Luxor" icon="🪲">
        <ControlForm {...{ setModal }} />
      </Header>
      <MainView
        className="luxor"
        onClick={({ target }) => {
          const { tagName, textContent, classList, parentNode } =
            target as HTMLElement;
          if (classList.contains("luxor-fld-add")) {
            dispatch(
              createNewField(
                Number((parentNode!.parentNode! as HTMLElement).id)
              )
            );
          } else if (classList.contains("luxor-fld-del")) {
            setModal({
              prompt: <>Azt a mezőt most törlöm...</>,
              lang: "hu",
              onSuccess: () =>
                dispatch(
                  removeField(
                    Number((parentNode!.parentNode! as HTMLElement).id)
                  )
                ),
            });
          } else if (locked && tagName === "TD") {
            const asNumber = Number(textContent);
            const num = isNaN(asNumber) ? 0 : asNumber;
            if (!(pickedNums as number[]).includes(num))
              dispatch(newNumber(num));
          }
        }}
      >
        {fields && (
          <>
            <PickedNumsLine {...{ setModal }} />
            <Fields />
          </>
        )}
      </MainView>
    </>
  );
}
