import { useContext, useState } from "react";

import { CxModal } from "../../hooks/modal";
import useInitCV from "../../hooks/cv/init";
import useCV from "../../hooks/cv";

import "./cv.css";

import Header from "../Header";
import MainView from "../MainView";
import Personal from "./personal";
import Education from "./education";
import Experience from "./experience";

const UPLOAD_CV = "upload your CV";
const DROP_CV = "drop files";

export default function CV() {
  useInitCV();
  const { fromItems, fromFiles } = useCV();
  const [task, setMsg] = useState(UPLOAD_CV);
  const modal = useContext(CxModal)!;

  return (
    <>
      <Header title="CV" onDragEnter={() => setMsg(DROP_CV)}>
        <div className="bordered padded">
          <label
            id="drop-zone"
            htmlFor="file-upload"
            className="clickable padded"
            onDrop={(ev) => {
              ev.preventDefault();

              if (ev.dataTransfer.items) {
                fromItems(ev.dataTransfer.items);
              } else {
                fromFiles(ev.dataTransfer.files);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setMsg(UPLOAD_CV);
            }}
          >
            <b>{task} here</b>
          </label>
          <a
            download
            href="/cv-template.yaml"
            onClick={() =>
              modal
                .ok()
                .en()
                .prompt(
                  <p>
                    Edit the downloaded template, then re-upload it along with a
                    pic
                  </p>
                )
            }
          >
            download template
          </a>
        </div>
        <input
          type="file"
          id="file-upload"
          accept="image/*,.yaml"
          style={{ display: "none" }}
          onChange={({ target: { files } }) => {
            if (files) fromFiles(files);
          }}
          multiple
        />
      </Header>
      <MainView className="cv" onDragEnter={() => setMsg(DROP_CV)}>
        <Personal />
        <div>
          <Experience />
          <Education />
        </div>
      </MainView>
    </>
  );
}
