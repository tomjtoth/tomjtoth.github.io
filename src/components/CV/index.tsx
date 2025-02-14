import { useContext, useState } from "react";

import useCV from "../../hooks/cv";

import "./cv.css";

import Header from "../Header";
import MainView from "../MainView";
import Personal from "./personal";
import Education from "./education";
import Experience from "./experience";
import { CxModal } from "../../hooks/modal";

const TEST_UR_CV = <b>upload your CV here</b>;

const DROP_UR_CV = <b>drop it here</b>;

export default function CV() {
  const { cv, img, fromItems, fromFiles } = useCV();
  const [msg, setMsg] = useState(TEST_UR_CV);
  const modal = useContext(CxModal)!;

  return (
    <>
      <Header title="CV" onDragEnter={() => setMsg(DROP_UR_CV)}>
        <div className="bordered padded">
          <label
            id="drop-zone"
            htmlFor="file-upload"
            className="clickable"
            onDrop={(ev) => {
              ev.preventDefault();

              if (ev.dataTransfer.items) {
                fromItems(ev.dataTransfer.items);
              } else {
                fromFiles(ev.dataTransfer.files);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {msg}
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
      <MainView className="cv" onDragEnter={() => setMsg(DROP_UR_CV)}>
        {cv && (
          <>
            <Personal {...{ cv, img }} />
            <Experience {...{ cv }} />
            <Education {...{ cv }} />
          </>
        )}
      </MainView>
    </>
  );
}
