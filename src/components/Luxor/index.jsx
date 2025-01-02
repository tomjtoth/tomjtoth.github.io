import { useSelector } from "react-redux";

import "./luxor.css";
import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Field from "./Field";

export default function () {
  const { fields, locked } = useSelector((s) => s.luxor);

  return (
    <>
      <Header title="Luxor" icon="🪲">
        <ControlForm />
      </Header>
      <MainView className="luxor">
        <ul className="luxor">
          {fields.map(({ id: fieldId, rows }) => (
            <Field
              key={fieldId}
              {...{ fieldId, rows, locked, deletable: fields.length > 1 }}
            />
          ))}
        </ul>
      </MainView>
    </>
  );
}
