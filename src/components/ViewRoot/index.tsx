import { createContext, PropsWithChildren, useState } from "react";

import "./view-root.css";

type Files = FileList | File[] | null;
type TCxFiles = {
  files: Files;
  reset: CallableFunction;
};

export const CxFiles = createContext<TCxFiles | null>(null);

export default function AppRoot({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState<Files>(null);

  return (
    <CxFiles.Provider value={{ files, reset: () => setFiles(null) }}>
      <div
        {...{
          id: "view-root",

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
              const arr = [...ev.dataTransfer.items]
                .map((item) => item.getAsFile())
                .filter((f) => f != null);

              if (arr.length > 0) setFiles(arr);
            } else if (ev.dataTransfer.files.length > 0) {
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
    </CxFiles.Provider>
  );
}
