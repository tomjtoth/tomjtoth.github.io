import { useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { spin } from "../../reducers";

export function Spinner() {
  // destructuring is fine for this component,
  // there's only these 2 props in reducer state...
  const { visible, fading } = useAppSelector((s) => s.spinner);
  const dispatch = useAppDispatch();
  const blur = useRef<HTMLDivElement>(null);

  return !visible ? null : (
    <div
      ref={blur}
      className={`bg-blur${fading ? " animate-bg-deblur" : ""}`}
      onAnimationEnd={(ev) => {
        console.debug("animation", ev.animationName, "ended");
        if (ev.animationName === "bg-deblur") {
          dispatch(spin.reset());

          // blur.current!.style.visibility = "hidden";
        }
      }}
    >
      <div
        className={`fixed z-20 left-1/2 top-1/2 -translate-1/2${
          fading ? " animate-spinner-zooming" : ""
        }`}
      >
        <div className="animate-spin border-bg-0 rounded-[50%] border-t-bg-alt-b border-16 w-[50vmin] h-[50vmin]" />
      </div>
    </div>
  );
}
