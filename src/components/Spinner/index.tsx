import { PropsWithChildren } from "react";

import "./spinner.css";
import useSpinner, { CxSpinner } from "../../hooks/spinner";

export default function Spinner({ children }: PropsWithChildren) {
  const logic = useSpinner();

  return (
    <CxSpinner.Provider value={logic}>
      {logic.active && (
        <div className="modal-blur">
          <div id="spinner" />
        </div>
      )}

      {children}
    </CxSpinner.Provider>
  );
}
