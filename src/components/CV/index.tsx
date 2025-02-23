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
        <div
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent calc(297mm - 1px),
              var(--color-fg-0) calc(297mm - 1px),
              var(--color-fg-0) 297mm
            )`,
          }}
          className="flex flex-col items-center w-[210mm] border m-4 print:border-none print:h-[297mm] print:m-0"
        >
          <div className="print:mb-[2mm] border rounded m-[10mm] flex text-[12pt] leading-[1.2] font-cv">
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
