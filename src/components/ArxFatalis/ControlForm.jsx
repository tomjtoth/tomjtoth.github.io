import { useSelector } from "react-redux";

export default function ({ noti }) {
  const { score } = useSelector((s) => s.arxFatalis);

  return (
    <>
      💎 {score}
      <a
        className="runes"
        href="https://wiki.arx-libertatis.org/Spells"
        target="_blank"
      >
        📖
      </a>
      {noti && (
        <>
          {noti.spell} ({noti.sequence.join(" + ")}) from page {noti.page}
        </>
      )}
      {/* TODO: <span id="reset-runes-score">reset</span> */}
    </>
  );
}
