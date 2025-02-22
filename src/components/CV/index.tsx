import useLogic from "./logic";

import "./cv.css";

import { ViewHeader, ViewContent } from "..";
import Controls from "./Controls";
import Personal from "./Personal";
import Details from "./Details";
import DetailsToggler from "./DetailsToggler";
import Skills from "./Skills";

export function CV() {
  useLogic();

  return (
    <>
      <ViewHeader className="print:hidden">
        <Controls />
      </ViewHeader>
      <ViewContent className="flex flex-wrap print:overflow-hidden">
        <div id="cv-page">
          <div id="cv" className="border rounded">
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

        <div id="cv-controls" className="border rounded print:hidden">
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
