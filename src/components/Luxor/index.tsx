import useLogic, { CxLuxor } from "./logic";

import "./luxor.css";

import Header from "../Header";
import MainView from "../MainView";
import Controls from "./Controls";
import Fields from "./Fields";
import PickedNumsLine from "./PickedNumsLine";

export default function Luxor() {
  const cxLuxor = useLogic();

  return (
    <CxLuxor.Provider value={cxLuxor}>
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
