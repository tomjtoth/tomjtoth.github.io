import "./luxor.css";

import ViewHeader from "../ViewHeader";
import ViewContent from "../ViewContent";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";
import useInit from "../../hooks/luxor/init";

export default function Luxor() {
  useInit();

  return (
    <>
      <ViewHeader title="Luxor">
        <Controls />
      </ViewHeader>
      <ViewContent className="luxor">
        <PickedNumsLine />
        <Fields />
      </ViewContent>
    </>
  );
}
