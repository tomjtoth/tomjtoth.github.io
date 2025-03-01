import { DragEvent, useState, createContext, useContext } from "react";

type Files = File[];
type Event = DragEvent<HTMLDivElement>;

const DZ_CLASSES = `z-10 fixed h-full w-full left-0 top-0 flex items-center justify-center backdrop-blur-md bg-black/40 text-shadow-40-20-10-bg0 text-2xl`;

const ccx = createContext<TCxFiles | null>(null);

type TCxFiles = {
  files: Files;
  reset: () => void;
};

export const useFiles = () => useContext(ccx)!;

export function useFilesVR() {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState<Files>([]);

  return {
    onDragEnter: (ev: Event) => {
      if (
        !visible &&
        [...ev.dataTransfer.items].filter((x) => x.kind === "file").length > 0
      ) {
        setVisible(true);
      }
    },

    dropZone: () => {
      if (!visible) return null;

      return (
        <div
          {...{
            className: DZ_CLASSES,

            onDragOver: (ev: Event) => ev.preventDefault(),
            onDragLeave: () => setVisible(false),

            onDrop: (ev: Event) => {
              // if (!visible) return;

              if (ev.dataTransfer.items.length > 0) {
                const arr = [...ev.dataTransfer.items]
                  .map((item) => item.getAsFile())
                  .filter((f) => f != null);

                if (arr.length > 0) setFiles(arr);
              } else if (ev.dataTransfer.files.length > 0) {
                setFiles([...ev.dataTransfer.files]);
              }

              setVisible(false);
              ev.preventDefault();
            },
          }}
        >
          Drag files here
        </div>
      );
    },
    ccx,
    cx: {
      files,
      reset: () => setFiles([]),
    },
  };
}
