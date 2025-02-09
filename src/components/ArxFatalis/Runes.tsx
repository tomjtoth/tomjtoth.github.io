import { useContext } from "react";
import { RUNES } from "../../types/arx-fatalis/runes";
import { CxRunes } from ".";
import Rune from "./Rune";
import useLogic from "./logic";

export default function Runes() {
  const { setQueue } = useContext(CxRunes)!;
  useLogic();

  return (
    <div id="runes">
      {RUNES.map(({ rune }, idx) => (
        <Rune
          key={idx}
          {...{ rune, onClick: () => setQueue((queue) => [...queue, idx]) }}
        />
      ))}
    </div>
  );
}
