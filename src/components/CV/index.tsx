import useLogic from "./logic";

import "./cv.css";

import ViewHeader from "../ViewHeader";
import Controls from "./Controls";
import ViewContent from "../ViewContent";
import Personal from "./Personal";
import Details from "./Details";
import DetailsToggler from "./DetailsToggler";

export default function CV() {
  useLogic();

  return (
    <>
      <ViewHeader className="no-print">
        <Controls />
      </ViewHeader>
      <ViewContent className="cv">
        <div id="cv" className="bordered">
          <Personal />
          <div className="cv-edu-work-container">
            <Details exp={true} />
            <Details exp={false} />
          </div>
        </div>
        <div
          style={{ margin: 16, padding: "0 16px" }}
          className="bordered no-print"
        >
          <h2>CONTROLS</h2>
          <p>
            Toggle inclusion of each detail in the printed document via the
            below checkboxes. You will see horizontal lines every 297mm, try to
            fit into 1 page.
          </p>
          <DetailsToggler exp={true} />
          <DetailsToggler exp={false} />
        </div>
      </ViewContent>
    </>
  );
}
