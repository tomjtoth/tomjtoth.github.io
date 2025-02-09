import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { init } from "../../reducers/arx-fatalis";

export default function Controls() {
  const arx = useAppSelector((s) => s.arxFatalis);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!arx) dispatch(init());
  }, []);

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
