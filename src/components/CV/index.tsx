import useInitCV from "../../hooks/cv/init";
import useCV from "../../hooks/cv";

import "./cv.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";
import Personal from "./Personal";
import Details from "./Details";
import DetailsToggler from "./DetailsToggler";

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
      <Header className="no-print">
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
        <div style={{ margin: 16, padding: "0 16px" }} className="bordered">
          <h2>CONTROLS</h2>
          <p>
            Toggle inclusion of each detail in the printed document via the
            below checkboxes. You will see horizontal lines every 297mm, try to
            fit into 1 page.
          </p>
          <DetailsToggler exp={true} />
          <DetailsToggler exp={false} />
        </div>
      </MainView>
    </div>
  );
}
