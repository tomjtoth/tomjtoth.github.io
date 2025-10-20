import { useAppSelector } from "../../hooks";
import { DetailsProps, EduDet, ExpDet } from "../../types/cv";

export default function Details({ exp }: DetailsProps) {
  const cv = useAppSelector((s) => s.cv.cv);

  const index = exp ? "experience" : "education";

  let res = null;

  if (cv) {
    res = (
      <>
        <h3 className="uppercase">
          <b>{index}</b>
        </h3>

        <ul className="pl-5 *:mt-3">
          {cv[index].map((det, i) => {
            const prefix = `cv.${index}[${i}]`;

            const loc = (
              <span className="cv-tip" title={`${prefix}.location`}>
                ({det.location})
              </span>
            );
            const duration = (
              <>
                {det.from === det.to ? (
                  <span className="cv-tip" title={`${prefix}.from`}>
                    during {det.from}
                  </span>
                ) : (
                  <>
                    <span className="cv-tip" title={`${prefix}.from`}>
                      {det.from}
                    </span>

                    {" - "}

                    <span className="cv-tip" title={`${prefix}.to`}>
                      {det.to}
                    </span>
                  </>
                )}
              </>
            );
            let liContent = null;

            if (exp) {
              det = det as ExpDet;
              liContent = (
                <>
                  <b className="cv-tip" title={`${prefix}.title`}>
                    {det.title}
                  </b>{" "}
                  | {duration}{" "}
                  {det.hours && (
                    <span className="cv-tip" title={`${prefix}.hours`}>
                      ({det.hours})
                    </span>
                  )}{" "}
                  <br />
                  {!!det.employer ? (
                    <>
                      at{" "}
                      <i className="cv-tip" title={`${prefix}.employer`}>
                        {det.employer}
                      </i>
                    </>
                  ) : (
                    <>alongside my studies</>
                  )}{" "}
                  {loc}
                </>
              );
            } else {
              det = det as EduDet;
              liContent = (
                <>
                  <b className="cv-tip" title={`${prefix}.degree`}>
                    {det.degree}
                  </b>{" "}
                  | {duration}
                  <br />
                  at{" "}
                  <i className="cv-tip" title={`${prefix}.institution`}>
                    {det.institution}
                  </i>{" "}
                  {loc}
                </>
              );
            }

            return (
              <li key={i} className={det.relevant ? undefined : "hidden"}>
                {liContent}

                <ul className="cv-detail-highlights pl-5 *:marker:content-['✓__']">
                  {det.highlights?.map((highlight, i) => (
                    <li
                      key={i}
                      className="cv-tip"
                      title={`${prefix}.highlights[${i}]`}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return res;
}
