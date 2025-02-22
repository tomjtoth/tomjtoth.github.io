import { useInit } from "./init";

import "./luxor.css";

import { ViewHeader, ViewContent } from "..";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export function Luxor() {
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
