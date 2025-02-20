import { useRef } from "react";

import { last } from "../../utils";
import { useAppDispatch, useAppSelector, useModal } from "../../hooks";
import {
  luxorBugHide,
  luxorBugMove,
  luxorBugReset,
  luxorPopNum,
} from "../../reducers/luxor";

export default function PickedNumsLine() {
  const pickedNums = useAppSelector((s) => s.luxor.pickedNums);
  const bug = useAppSelector((s) => s.luxor.bug);
  const modal = useModal();
  const dispatch = useAppDispatch();

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
            .ok(() =>
              dispatch(
                luxorBugMove(
                  span.current!.getBoundingClientRect().right - 8,
                  true
                )
              )
            )
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
        style={{ left: bug.position, transition: bug.transition }}
        onTransitionEnd={() => {
          if (bug.position !== "-10vw" && bug.position !== "110vw") {
            dispatch(luxorBugHide());
            dispatch(luxorPopNum());
          } else if (bug.position === "-10vw") {
            dispatch(luxorBugReset());
          }
        }}
      >
        🪲
      </div>

      {bug.filtered && (
        <div
          id="luxor-num-bug-priv-filter"
          style={{ left: bug.position }}
          onAnimationEnd={() => dispatch(luxorBugMove("-10vw", false))}
        />
      )}
    </div>
  );
}
