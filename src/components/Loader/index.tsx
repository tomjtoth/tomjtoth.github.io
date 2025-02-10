import { createContext, PropsWithChildren, useState } from "react";

import "./loader.css";

export const CxLoader = createContext({
  show: () => {},
  hide: () => {},
});

export default function Loader({ children }: PropsWithChildren) {
  const [active, setActive] = useState(false);

  return (
    <CxLoader.Provider
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
          <div id="loader" />
        </div>
      )}

      {children}
    </CxLoader.Provider>
  );
}
