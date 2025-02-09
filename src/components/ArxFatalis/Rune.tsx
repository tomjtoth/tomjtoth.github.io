import { RuneProps } from "../../types/arx-fatalis";
import { RE } from "../../types/arx-fatalis/runes";

export default function Rune({ rune, onClick }: RuneProps) {
  const asStr = RE[rune];
  const src = `/arx/runes/${asStr.toLowerCase()}.png`;

  return (
    <img
      {...{
        draggable: false,
        className: onClick ? "clickable" : "",
        alt: asStr,
        title: asStr,
        src,
        onClick,
      }}
    />
  );
}
