import { createContext, PropsWithChildren, useState } from "react";

import { TCxSpinner } from "../../types/spinner";

import "./spinner.css";

export const CxSpinner = createContext<TCxSpinner>(undefined);

export default function Spinner({ children }: PropsWithChildren) {
  const [active, setActive] = useState(false);

  const spinner = {
    show: () => {
      console.debug("showing spinner");
      setActive(true);
    },

    // hiding with a delay
    hide: () => {
      if (active) {
        console.debug("hiding spinner");
        setTimeout(() => setActive(false), 250);
      }
    },
  } as TCxSpinner;

  return (
    <CxSpinner.Provider value={spinner}>
      {active && (
        <div className="modal-blur">
          <div id="spinner" />
        </div>
      )}

      {children}
    </CxSpinner.Provider>
  );
}
