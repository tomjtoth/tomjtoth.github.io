import useArxFatalis from "../../hooks/arx-fatalis";

import "./arx-fatalis.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";
import Img from "./Img";

export default function ArxFatalis() {
  const { arx, runes, push } = useArxFatalis();

  return (
    <>
      <Header title="riimut">{arx && <Controls arx={arx} />}</Header>
      <MainView className="arx-fatalis">
        <div id="runes-spacer" />
        <div id="runes">
          {runes.map((rune, i) => (
            <Img
              key={i}
              {...{
                rune,
                onClick: () => push(rune),
              }}
            />
          ))}
        </div>
      </MainView>
    </>
  );
}
