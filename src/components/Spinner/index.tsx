import { createContext, PropsWithChildren, useState } from "react";

import "./spinner.css";

export const CxSpinner = createContext({
  show: () => {},
  hide: () => {},
});

export default function Spinner({ children }: PropsWithChildren) {
  const [active, setActive] = useState(false);

  return (
    <CxSpinner.Provider
      value={{
        show: () => {
          setActive(true);
        },

        // hiding with a delay
        hide: () => {
          if (active) setTimeout(() => setActive(false), 250);
        },
      }}
    >
      {active && (
        <div className="modal-blur">
          <div id="spinner" />
        </div>
      )}

      {children}
    </CxSpinner.Provider>
  );
}
