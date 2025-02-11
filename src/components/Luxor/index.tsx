import useLuxor, { CxLuxor } from "../../hooks/luxor";

import "./luxor.css";

import Header from "../Header";
import MainView from "../MainView";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export default function Luxor() {
  const logic = useLuxor();

  return (
    <CxLuxor.Provider value={logic}>
      <Header title="Luxor" icon="🪲">
        <Controls />
      </Header>
      <MainView className="luxor">
        <PickedNumsLine />
        <Fields />
      </MainView>
    </CxLuxor.Provider>
  );
}
