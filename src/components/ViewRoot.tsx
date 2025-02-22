import { createContext, PropsWithChildren, useState } from "react";

type Files = FileList | File[] | null;
type TCxFiles = {
  files: Files;
  reset: CallableFunction;
};

export const CxFiles = createContext<TCxFiles | null>(null);

export function ViewRoot({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState<Files>(null);

  return (
    <CxFiles.Provider value={{ files, reset: () => setFiles(null) }}>
      <div
        {...{
          className: "m-0 h-full flex flex-col",

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
          <div className="text-2xl flex items-center justify-center drop-shadow-md modal-blur">
            Try dropping on the blurred area 🤞
          </div>
        )}

        {children}
      </div>
    </CxFiles.Provider>
  );
}

// text-shadow: 0 0 40px var(--col-bg-0), 0 0 20px var(--col-bg-0), 0 0 10px var(--col-bg-0);
