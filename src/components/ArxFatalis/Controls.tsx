import { useAppSelector } from "../../hooks";

export default function Controls() {
  const arx = useAppSelector((s) => s.arxFatalis);

  return (
    <>
      💎&nbsp;{arx && arx.score}
      <a
        className="spells"
        href="https://wiki.arx-libertatis.org/Spells"
        target="_blank"
      >
        📖
      </a>
      {/* TODO: <span id="reset-runes-score">reset</span> */}
    </>
  );
}
