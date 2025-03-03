import { PropsWithChildren } from "react";

import { ModalProvider } from ".";
import { useFilesVR } from "../hooks";

export function ViewRoot({ children }: PropsWithChildren) {
  const files = useFilesVR();

  return (
    <ModalProvider>
      <files.ccx.Provider value={files.cx}>
        <div
          className="m-0 h-full flex flex-col"
          onDragEnter={files.onDragEnter}
        >
          <files.dropZone />
          {children}
        </div>
      </files.ccx.Provider>
    </ModalProvider>
  );
}
