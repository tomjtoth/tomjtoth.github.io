import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import "./luxor.css";
import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Field from "./Field";
import {
  createNewField,
  deleteField,
  fieldsFromPreset,
} from "../../reducers/luxor";
import { useEffect } from "react";

export default function () {
  const dispatch = useDispatch();
  const { fields } = useSelector((s) => s.luxor);

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
      <Header title="Luxor" icon="🪲">
        <ControlForm />
      </Header>
      <MainView
        className="luxor"
        onClick={({ target: { classList, parentNode } }) => {
          if (classList.contains("luxor-fld-add")) {
            dispatch(createNewField(parentNode.id));
          } else if (classList.contains("luxor-fld-del")) {
            dispatch(deleteField(parentNode.id));
          }
        }}
      >
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
