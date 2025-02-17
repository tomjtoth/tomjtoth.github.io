import { useAppSelector } from "../../hooks";
import useSpinner from "../../hooks/spinner";

import "./spinner.css";

export default function Spinner() {
  const { active, className } = useAppSelector((s) => s.spinner);
  const { reset } = useSpinner();

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
                reset();

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
