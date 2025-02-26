import useLogic from "./logic";

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
        <div className="flex flex-col items-center max-w-[210mm] md:w-[210mm] md:border md:m-4 print:border-none print:h-[297mm] print:m-0 lg:bg-297-fg0">
          <div className="print:mb-[2mm] md:border print:border rounded md:m-[10mm] print:m-[10mm] flex flex-col md:flex-row print:flex-row text-[12pt] leading-[1.2] font-cv">
            <Personal />
            <div className="px-4">
              <Details exp={true} />
              <Skills />
              <Details exp={false} />
            </div>
          </div>
          <div className="hidden print:block">
            this page was generated at {window.location.toString()}
          </div>
        </div>

        <div className="border rounded print:hidden m-4 px-4 max-h-fit max-w-[calc(210mm-2*16px)]">
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
