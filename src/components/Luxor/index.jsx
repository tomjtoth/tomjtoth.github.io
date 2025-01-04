import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import {
  createNewField,
  deleteField,
  fieldsFromPreset,
  newNumber,
} from "../../reducers/luxor";

import "./luxor.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Field from "./Field";
import { last } from "../../utils";

export default function () {
  const [modal, setModal] = useState({});

  const dispatch = useDispatch();
  const { fields, locked, pickedNums } = useSelector((s) => s.luxor);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(search);
    const preset = sp.get("preset");
    if (preset) {
      dispatch(fieldsFromPreset(preset));
      navigate(pathname);
    }
  }, []);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="Luxor" icon="🪲">
        <ControlForm {...{ setModal }} />
      </Header>
      <MainView
        className="luxor"
        onClick={({
          target: { tagName, textContent, classList, parentNode },
        }) => {
          if (classList.contains("luxor-fld-add")) {
            dispatch(createNewField(parentNode.parentNode.id));
          } else if (classList.contains("luxor-fld-del")) {
            setModal({
              prompt: <>Azt a mezőt most törlöm...</>,
              lang: "hu",
              onSuccess: () => dispatch(deleteField(parentNode.parentNode.id)),
            });
          } else if (locked && tagName === "TD") {
            const asNumber = Number(textContent);
            dispatch(newNumber(isNaN(asNumber) ? 0 : asNumber));
          }
        }}
      >
        <div id="luxor-picked-nums-line">
          {pickedNums.length > 0 && (
            <>
              {pickedNums.length > 10
                ? `...${last(pickedNums, 10).join(", ")}`
                : pickedNums.join(", ")}{" "}
              <div id="luxor-num-bug">🪲</div>
            </>
          )}
        </div>
        <ul className="luxor">
          {fields.map(({ id: fieldId, rows, importedAt }) => (
            <Field
              key={fieldId}
              {...{ fieldId, rows, deletable: fields.length > 1, importedAt }}
            />
          ))}
        </ul>
      </MainView>
    </>
  );
}
