import { ImgProps } from "../../types/arx-fatalis";

export default function Rune({ rune, onClick }: ImgProps) {
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
