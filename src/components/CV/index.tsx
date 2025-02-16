import useInitCV from "../../hooks/cv/init";
import useCV from "../../hooks/cv";

import "./cv.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";
import Personal from "./Personal";
import Details from "./Details";

export default function CV() {
  useInitCV();

  const { onDragEnter, onDrop } = useCV();

  return (
    <div
      {...{
        id: "cv-container",
        onDrop,
        onDragEnter,
        onDragOver: (ev) => ev.preventDefault(),
      }}
    >
      <Header title="CV" className="no-print">
        <Controls />
      </Header>
      <MainView className="cv">
        <div id="cv" className="bordered">
          <Personal />
          <div className="cv-edu-work-container">
            <Details exp={true} />
            <Details exp={false} />
          </div>
        </div>
      </MainView>
    </div>
  );
}
