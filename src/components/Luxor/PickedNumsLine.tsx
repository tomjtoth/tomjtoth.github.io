import { useContext, useRef } from "react";

import { last } from "../../utils";
import { CxModal } from "../Modal";
import { CxLuxor } from "./logic";

export default function PickedNumsLine() {
  const modal = useContext(CxModal)!;
  const { bug, moveBug, hideBug, resetBug, pickedNums, rmLastNum } =
    useContext(CxLuxor)!;

  const span = useRef<HTMLSpanElement>(null);

  return (
    <div id="luxor-picked-nums-line">
      <span ref={span}>
        {pickedNums.length > 10 && "..."}
        {(last(pickedNums, 10) as number[]).join(", ")}
      </span>

      <span
        className="clickable"
        style={{ visibility: pickedNums.length === 0 ? "hidden" : undefined }}
        onClick={() =>
          modal
            .hu()
            .ok(() => moveBug(span.current!.getBoundingClientRect().right - 8))
            .cancel()
            .prompt(
              <>
                Törlöm az <strong>utolsó</strong> húzott számot
              </>
            )
        }
      >
        ⬅️
      </span>

      <div
        id="luxor-num-bug"
        className={bug.crawling ? "crawling" : undefined}
        style={{ left: bug.position }}
        onTransitionEnd={() => {
          if (bug.position !== "-10vw" && bug.position !== "110vw") {
            hideBug();
            rmLastNum();
          } else if (bug.position === "-10vw") {
            resetBug();
          }
        }}
      >
        🪲
      </div>

      {bug.filtered && (
        <div
          id="luxor-num-bug-priv-filter"
          style={{ left: bug.position }}
          onAnimationEnd={() => moveBug("-10vw")}
        />
      )}
    </div>
  );
}
