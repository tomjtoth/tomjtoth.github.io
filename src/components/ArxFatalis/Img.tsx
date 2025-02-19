import { MouseEventHandler } from "react";

import { Rune as RuneClass } from "../../types/arx-fatalis/runes";

type ImgProps = {
  rune: RuneClass;
  onClick?: MouseEventHandler;
};

export default function Img({ rune, onClick }: ImgProps) {
  const { name, png } = rune;

  return (
    <img
      {...{
        draggable: false,
        className: onClick ? "clickable" : "",
        alt: name,
        title: name,
        src: png,
        onClick,
      }}
    />
  );
}
