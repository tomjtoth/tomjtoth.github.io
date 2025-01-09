import { useAppSelector } from "../../hooks";
import { ControlFormProps } from "./types";

export default function ControlForm({ noti }: ControlFormProps) {
  const { score } = useAppSelector((s) => s.arxFatalis);

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
