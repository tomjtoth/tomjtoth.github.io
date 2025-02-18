import { createContext, PropsWithChildren, useState } from "react";

import "./app-root.css";

export const CxFileDropZone = createContext<FileList | File[] | null>(null);

export default function AppRoot({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState<FileList | File[] | null>(null);

  return (
    <CxFileDropZone.Provider value={files}>
      <div
        {...{
          id: "app-root",

          onDragEnter: (ev) => {
            if (
              !visible &&
              [...ev.dataTransfer.items].filter((x) => x.kind === "file")
                .length > 0
            ) {
              setVisible(true);
            }
          },

          // dragged files in, but
          // onDragLeave: () => visible && setVisible(false),

          onDrop: (ev) => {
            if (!visible) return;

            if (ev.dataTransfer.items.length > 0) {
              setFiles(
                [...ev.dataTransfer.items]
                  .map((item) => item.getAsFile())
                  .filter((f) => f != null)
              );
            } else {
              setFiles(ev.dataTransfer.files);
            }

            setVisible(false);
            ev.preventDefault();
          },

          onDragOver: (ev) => ev.preventDefault(),
        }}
      >
        {visible && (
          <div className="modal-blur">Try dropping on the blurred area 🤞</div>
        )}

        {children}
      </div>
    </CxFileDropZone.Provider>
  );
}
