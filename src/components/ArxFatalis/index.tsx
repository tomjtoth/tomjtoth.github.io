import { Rune } from "../../types/arx-fatalis/runes";
import useLogic from "./logic";

import "./arx-fatalis.css";

import { ViewHeader, ViewContent } from "..";
import Controls from "./Controls";
import Img from "./Img";

export function ArxFatalis() {
  const push = useLogic();

  return (
    <>
      <ViewHeader title="riimut">
        <Controls />
      </ViewHeader>
      <ViewContent className="flex flex-col">
        <div id="runes-spacer" />
        <div id="runes">
          {Rune.arr.map((rune, i) => (
            <Img
              key={i}
              {...{
                rune,
                onClick: () => push(rune),
              }}
            />
          ))}
        </div>
      </ViewContent>
    </>
  );
}
