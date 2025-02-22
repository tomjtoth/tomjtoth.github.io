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
        id="cv-download"
        ref={downloadRef}
        download="cv-template.yaml"
        href={url}
      />
      <input
        id="cv-upload"
        ref={uploadRef}
        type="file"
        className="cv"
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
        className="clickable p-4 border rounded"
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
        download this template
      </span>

      <span
        className="p-4 border rounded clickable"
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
        <b>upload your CV</b>
      </span>
      <span
        className="clickable p-4"
        title="print (Ctrl + P)"
        onClick={() => {
          const cookie = "cv-printed";
          const reminded = Number(getCookie(cookie) ?? "0");

          if (reminded < 2) {
            modal
              .en()
              .ok(() => {
                print();
                setCookie(cookie, reminded + 1);
              })
              .cancel()
              .prompt(
                <p>
                  I recommend setting a 94% scale and default marings, that was
                  working fine for me
                </p>
              );
          } else {
            // do not prompt more than 2x within 7 days
            print();
            setCookie(cookie, reminded + 1);
          }
        }}
      >
        🖨️
      </span>
    </>
  );
}
