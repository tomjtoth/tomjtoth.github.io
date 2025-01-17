import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ControlFormProps } from "../../types/arx-fatalis";
import { init } from "../../reducers/arx-fatalis";

export default function ControlForm({ noti }: ControlFormProps) {
  const arx = useAppSelector((s) => s.arxFatalis);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!arx) dispatch(init());
  }, []);

  return (
    <>
      💎&nbsp;{arx && arx.score}
      <a
        className="runes"
        href="https://wiki.arx-libertatis.org/Spells"
        target="_blank"
      >
        📖
        {noti && (
          <>
            &nbsp;<sub>{noti.page}</sub>
          </>
        )}
      </a>
      {noti && (
        <>
          {noti.spell} ({noti.sequence.join(" + ")})
        </>
      )}
      {/* TODO: <span id="reset-runes-score">reset</span> */}
    </>
  );
}
