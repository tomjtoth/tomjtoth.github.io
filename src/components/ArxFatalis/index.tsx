import useArxFatalis from "../../hooks/arx-fatalis";

import "./arx-fatalis.css";

import ViewHeader from "../ViewHeader";
import Controls from "./Controls";
import ViewContent from "../ViewContent";
import Img from "./Img";

export default function ArxFatalis() {
  const { arx, runes, push } = useArxFatalis();

  return (
    <>
      <ViewHeader title="riimut">{arx && <Controls arx={arx} />}</ViewHeader>
      <ViewContent className="arx-fatalis">
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
      </ViewContent>
    </>
  );
}
