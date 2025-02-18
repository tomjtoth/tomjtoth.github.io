import { useContext } from "react";

import { CxModal } from "../../hooks/modal";
import useCV from "../../hooks/cv";

export default function Controls() {
  const modal = useContext(CxModal)!;
  const { url, fromFiles } = useCV();

  return (
    <>
      <input
        type="file"
        id="cv-file-upload"
        className="cv"
        accept="image/*,.yaml"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            fromFiles(files).then(() => {
              e.target.value = "";
            });
          }
        }}
        multiple
      />
      <label className="padded bordered clickable" htmlFor="cv-file-upload">
        <b>drag/upload your CV here</b>
      </label>
      <a
        download="cv-template.yaml"
        href={url}
        onClick={() =>
          modal
            .ok()
            .en()
            .prompt(
              <p>
                Edit the downloaded template{" "}
                <u>
                  <b>paying attention to indentation</b>
                </u>
                , then re-upload it along with a pic
              </p>
            )
        }
      >
        template
      </a>
      <span
        className="clickable padded"
        title="print (Ctrl + P)"
        onClick={print}
      >
        🖨️
      </span>
    </>
  );
}
