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

            let title = null;

            if (exp) {
              det = det as ExpDet;
              title = (
                <>
                  <b>{det.title}</b> | {det.from} - {det.to}{" "}
                  {det.hours && <>({det.hours}) </>}
                  at <i>{det.company}</i> ({det.city})
                </>
              );
            } else {
              det = det as EduDet;
              title = (
                <>
                  <b>{det.title}</b> | {det.from} - {det.to} at{" "}
                  <i>{det.school}</i> ({det.city})
                </>
              );
            }

            return (
              <li key={i} className={buffer[i] ? undefined : "no-print"}>
                <input
                  id={inputId}
                  type="checkbox"
                  checked={buffer[i]}
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
                  {det.top5?.map((r, i) => (
                    <li key={i}>{r}</li>
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
