import { useState } from "react";

import { RE } from "../../types/arx-fatalis/runes";
import { Rune } from "../../types/arx-fatalis/runes";
import useLogic from "./logic";

import "./arx-fatalis.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";
import Img from "./Img";

export default function ArxFatalis() {
  const [queue, setQueue] = useState<RE[]>([]);
  useLogic({ queue, setQueue });

  return (
    <>
      <Header title="riimut">
        <Controls />
      </Header>
      <MainView className="arx-fatalis">
        <div id="runes-spacer" />
        <div id="runes">
          {Rune.arr.map((rune) => (
            <Img
              key={rune.str()}
              {...{
                rune,
                onClick: () => setQueue((queue) => [...queue, rune.variant]),
              }}
            />
          ))}
        </div>
      </MainView>
    </>
  );
}
