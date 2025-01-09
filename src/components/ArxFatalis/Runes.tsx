import { runes } from "./config";

export default function Runes() {
  return (
    <div id="runes">
      {runes.map(({ rune }) => (
        <img
          key={rune}
          {...{
            draggable: false,
            className: "clickable",
            alt: rune,
            title: rune,
            src: `/arx/runes/${rune.toLowerCase()}.png`,
          }}
        />
      ))}
    </div>
  );
}
