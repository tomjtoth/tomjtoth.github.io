import { createContext, useState } from "react";

import { CxRunesType } from "../../types/arx-fatalis";
import { RE } from "../../types/arx-fatalis/runes";

import "./arx-fatalis.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";
import Runes from "./Runes";

export const CxRunes = createContext<CxRunesType>(undefined);

export default function ArxFatalis() {
  const [queue, setQueue] = useState<RE[]>([]);

  return (
    <CxRunes.Provider value={{ queue, setQueue }}>
      <Header title="riimut">
        <Controls />
      </Header>
      <MainView className="arx-fatalis">
        <div id="runes-drawing">{/* TODO: implement drawing by finger */}</div>
        <Runes />
      </MainView>
    </CxRunes.Provider>
  );
}
