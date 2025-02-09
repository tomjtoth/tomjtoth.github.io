import { RuneProps } from "../../types/arx-fatalis";

export default function Rune({ rune, onClick }: RuneProps) {
  const str = rune.str();

  return (
    <img
      {...{
        draggable: false,
        className: onClick ? "clickable" : "",
        alt: str,
        title: str,
        src: rune.png(),
        onClick,
      }}
    />
  );
}
