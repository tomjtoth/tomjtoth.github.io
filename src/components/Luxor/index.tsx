import { useInit } from "./init";
import { useAppSelector } from "../../hooks";

import { ViewHeader, ViewContent } from "..";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export function Luxor() {
  useInit();
  const rick = useAppSelector((s) => s.luxor.rick);
  const classes = `z-5 fixed bottom-0 duration-150 -translate-x-1/2 ${
    rick ? "left-1/2" : "left-3/2"
  }`;

  return (
    <>
      <ViewHeader title="Luxor">
        <Controls />
      </ViewHeader>
      <ViewContent className="luxor">
        <PickedNumsLine />
        <Fields />
      </ViewContent>
      <img src="/rick.gif" alt="dancing Rick" className={classes} />
    </>
  );
}
