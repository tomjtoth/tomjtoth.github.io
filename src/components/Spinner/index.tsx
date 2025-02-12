import { PropsWithChildren } from "react";

import "./spinner.css";
import useSpinner, { CxSpinner } from "../../hooks/spinner";

export default function Spinner({ children }: PropsWithChildren) {
  const logic = useSpinner();
  const { active, className, reset } = logic;

  return (
    <CxSpinner.Provider value={logic}>
      {active && (
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
      )}

      {children}
    </CxSpinner.Provider>
  );
}
