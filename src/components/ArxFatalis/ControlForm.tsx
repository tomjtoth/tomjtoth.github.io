import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ControlFormProps } from "../../types/arx-fatalis";
import { initArxFatalis } from "../../reducers/arx-fatalis";

export default function ControlForm({ noti }: ControlFormProps) {
  const { arxFatalis } = useAppSelector((s) => s);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!arxFatalis) dispatch(initArxFatalis());
  }, []);

  return (
    <>
      💎 {arxFatalis && arxFatalis.score}
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
