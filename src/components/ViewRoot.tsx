import { PropsWithChildren, useRef } from "react";

import { ModalProvider, CxViewContent } from ".";
import { useFilesVR } from "../hooks";

export function ViewRoot({ children }: PropsWithChildren) {
  const files = useFilesVR();
  const vcRef = useRef<HTMLDivElement>(null);

  return (
    <ModalProvider>
      <files.ccx.Provider value={files.cx}>
        <CxViewContent.Provider value={vcRef}>
          <div
            className="m-0 h-full flex flex-col"
            onDragEnter={files.onDragEnter}
          >
            <files.dropZone />
            {children}
          </div>
        </CxViewContent.Provider>
      </files.ccx.Provider>
    </ModalProvider>
  );
}
