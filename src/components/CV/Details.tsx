import { useEffect, useState } from "react";

import useCV from "../../hooks/cv";
import { EduDet, ExpDet } from "../../types/cv";

type DetailsProps = {
  exp: boolean;
};

export default function Details({ exp }: DetailsProps) {
  const { cv } = useCV();
  const [relevant, setRelevant] = useState<boolean[] | null>(null);

  const index = exp ? "experience" : "education";

  useEffect(() => {
    if (cv) setRelevant(cv[index].map((xp) => xp.relevant ?? true));
  }, [cv]);

  let res = null;

  if (cv && relevant) {
    let buffer = [...relevant];
    console.debug(`rendering <Details exp={${exp}} />`);

    res = (
      <>
        <h2>
          <b>{index.toUpperCase()}</b>
        </h2>

        <ul>
          {cv[index].map((det, i) => {
            const inputId = `cv-show-${index}-${i}`;
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
            let title = null;

            if (exp) {
              det = det as ExpDet;
              title = (
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
                  at{" "}
                  <i className="cv-tip" title={`${prefix}.employer`}>
                    {det.employer}
                  </i>{" "}
                  {loc}
                  {det.summary && <p>{det.summary}</p>}
                </>
              );
            } else {
              det = det as EduDet;
              title = (
                <>
                  <b className="cv-tip" title={`cv.${index}[${i}].degree`}>
                    {det.degree}
                  </b>{" "}
                  | {duration} at{" "}
                  <i className="cv-tip" title={`cv.${index}[${i}].institution`}>
                    {det.institution}
                  </i>{" "}
                  {loc}
                  {/* TODO: add title for location, from, to, institution, etc yaml props  */}
                </>
              );
            }

            return (
              <li
                key={i}
                className={`cv-detail${buffer[i] ? "" : " no-print"}`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={buffer[i]}
                  title={`${
                    buffer[i] ? "included in" : "hidden from"
                  } the final printed pdf`}
                  className="no-print clickable"
                  onChange={(e) => {
                    buffer[i] = e.target.checked;
                    setRelevant(buffer);
                  }}
                />

                <label htmlFor={inputId} className="clickable">
                  {title}
                </label>

                <ul>
                  {det.highlights?.map((r, i) => (
                    <li className="cv-detail-highlights" key={i}>
                      {r}
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
