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
    <div
      id="luxor-picked-nums-line"
      className="flex items-center justify-center gap-2 p-2"
    >
      <span ref={span}>
        {pickedNums.length > 10 && "..."}
        {(last(pickedNums, 10) as number[]).join(", ")}
      </span>

      <span
        className={`clickable ${
          pickedNums.length === 0 ? "invisible" : "visible"
        }`}
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
        className="fixed z-1 text-4xl select-none animate-luxor-bug"
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
          className="fixed z-2 w-15 h-15 rounded-full border-2 border-red-500 cursor-not-allowed -translate-x-[50%] animate-luxor-bug-blur"
          style={{ left: bug.position }}
          onAnimationEnd={() => dispatch(luxorBugMove("-10vw", false))}
        />
      )}
    </div>
  );
}
