import { PropsWithChildren } from "react";

import { ModalProvider, ViewContentRefProvider } from ".";
import { useFilesVR } from "../hooks";

export function ViewRoot({ children }: PropsWithChildren) {
  const files = useFilesVR();

  return (
    <ModalProvider>
      <files.ccx.Provider value={files.cx}>
        <ViewContentRefProvider>
          <div
            className="m-0 h-full flex flex-col"
            onDragEnter={files.onDragEnter}
          >
            <files.dropZone />
            {children}
          </div>
        </ViewContentRefProvider>
      </files.ccx.Provider>
    </ModalProvider>
  );
}
