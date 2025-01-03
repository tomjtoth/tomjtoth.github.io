import { runes } from "./config";

export default function () {
  return (
    <div id="runes">
      {Object.keys(runes).map((rune) => (
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
