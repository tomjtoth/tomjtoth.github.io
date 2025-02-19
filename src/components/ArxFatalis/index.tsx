import { Rune } from "../../types/arx-fatalis/runes";
import useLogic from "./logic";

import "./arx-fatalis.css";

import ViewHeader from "../ViewHeader";
import Controls from "./Controls";
import ViewContent from "../ViewContent";
import Img from "./Img";

export default function ArxFatalis() {
  const push = useLogic();

  return (
    <>
      <ViewHeader title="riimut">
        <Controls />
      </ViewHeader>
      <ViewContent className="arx-fatalis">
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
