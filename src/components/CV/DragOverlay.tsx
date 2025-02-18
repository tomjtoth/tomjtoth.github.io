import { PropsWithChildren, useState } from "react";
import useCV from "../../hooks/cv";

export default function DragOverlay({ children }: PropsWithChildren) {
  const { fromFiles, fromItems } = useCV();

  const [visible, setVisible] = useState(false);

  return (
    <div id="cv-container" onDragEnter={() => setVisible(true)}>
      {visible && (
        <div
          id="drop-zone"
          className="modal-blur"
          onDrop={(ev) => {
            ev.preventDefault();

            if (ev.dataTransfer!.items) {
              fromItems(ev.dataTransfer!.items);
            } else {
              fromFiles(ev.dataTransfer!.files);
            }
            setVisible(false);
          }}
          onDragOver={(ev) => ev.preventDefault()}
        >
          Try dropping on the blurred area 🤞
        </div>
      )}
      {children}
    </div>
  );
}
