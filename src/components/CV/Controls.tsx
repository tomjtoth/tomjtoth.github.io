import { useRef } from "react";

import { useAppSelector, useModal } from "../../hooks";
import { useFilesToCV } from "./logic";
import { getCookie, setCookie } from "../../utils";

export default function Controls() {
  const filesToCV = useFilesToCV();
  const url = useAppSelector((s) => s.cv.url);
  const modal = useModal();

  const uploadRef = useRef<HTMLInputElement | null>(null);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  return (
    <>
      <a
        className="hidden"
        ref={downloadRef}
        download="cv-template.yaml"
        href={url}
      />
      <input
        ref={uploadRef}
        type="file"
        className="hidden"
        accept="image/*,.yaml"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            filesToCV(files).then(() => {
              e.target.value = "";
            });
          }
        }}
        multiple
      />

      <span
        className="clickable p-2 border rounded"
        onClick={() => {
          const cookie = "cv-downloaded";
          const reminded = Number(getCookie(cookie) ?? "0");

          if (reminded < 2) {
            modal
              .en()
              .ok(() => {
                downloadRef.current?.click();
                setCookie(cookie, reminded + 1);
              })
              .cancel()
              .prompt(
                <p>
                  Edit the downloaded template{" "}
                  <u>
                    <b>paying attention to indentation</b>
                  </u>
                  , then re-upload it along with a pic.
                </p>
              );
          } else {
            // do not prompt more than 2x within 7 days
            downloadRef.current?.click();
            setCookie(cookie, reminded + 1);
          }
        }}
      >
        <span className="hidden sm:contents">download this </span>
        template
      </span>

      <span
        className="p-2 border rounded clickable"
        onClick={() => {
          const cookie = "cv-uploaded";
          const reminded = Number(getCookie(cookie) ?? "0");

          if (reminded < 2) {
            modal
              .en()
              .ok(() => {
                uploadRef.current?.click();
                setCookie(cookie, reminded + 1);
              })
              .cancel()
              .prompt(
                <p>
                  You can pick any image or <code>*.yaml</code> files, only the
                  first one of both types will be recognized. Alternatively you
                  can drag and drop files anywhere.
                </p>
              );
          } else {
            // do not prompt more than 2x within 7 days
            uploadRef.current?.click();
            setCookie(cookie, reminded + 1);
          }
        }}
      >
        <b>
          upload
          <span className="hidden sm:contents"> your CV</span>
        </b>
      </span>
      <span
        className="clickable p-2 mx-2"
        title="print (Ctrl + P)"
        onClick={print}
      >
        🖨️
      </span>
    </>
  );
}
