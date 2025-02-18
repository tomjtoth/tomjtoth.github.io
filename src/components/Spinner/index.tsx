import { useAppDispatch, useAppSelector } from "../../hooks";
import { resetSpinner } from "../../reducers/spinner";

import "./spinner.css";

export default function Spinner() {
  const { active, className } = useAppSelector((s) => s.spinner);
  const dispatch = useAppDispatch();

  return (
    active && (
      <div className="modal-blur">
        <div
          {...{
            id: "spinner",
            className,
            onAnimationEnd: (ev) => {
              console.debug("animation", ev.animationName, "ended");
              if (ev.animationName === "zoom-in") {
                dispatch(resetSpinner());

                // React's async state change is too slow
                const circle = ev.target as HTMLDivElement;
                const blur = circle.parentNode as HTMLDivElement;
                [circle, blur].forEach(
                  (div) => (div.style.visibility = "hidden")
                );
              }
            },
          }}
        />
      </div>
    )
  );
}
