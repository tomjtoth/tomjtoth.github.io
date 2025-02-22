import useLogic from "./logic";

import "./cv.css";

import ViewHeader from "../ViewHeader";
import Controls from "./Controls";
import ViewContent from "../ViewContent";
import Personal from "./Personal";
import Details from "./Details";
import DetailsToggler from "./DetailsToggler";
import Skills from "./Skills";

export default function CV() {
  useLogic();

  return (
    <>
      <ViewHeader className="no-print">
        <Controls />
      </ViewHeader>
      <ViewContent className="cv">
        <div id="cv-page">
          <div id="cv" className="bordered">
            <Personal />
            <div className="cv-edu-work-container">
              <Details exp={true} />
              <Skills />
              <Details exp={false} />
            </div>
          </div>
          <div id="cv-footer">
            this page was generated at {window.location.toString()}
          </div>
        </div>

        <div id="cv-controls" className="bordered no-print">
          <h2>CONTROLS</h2>
          <p>
            Toggle inclusion of each detail in the printed document via the
            below checkboxes. You will see horizontal lines every 297mm, try to
            fit into 1 page. There's a hard-coded 10mm margin currently.
          </p>
          <DetailsToggler exp={true} />
          <DetailsToggler exp={false} />
        </div>
      </ViewContent>
    </>
  );
}
