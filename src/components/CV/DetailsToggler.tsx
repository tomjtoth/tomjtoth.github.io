import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleRelevance } from "../../reducers/cv";
import { DetailsProps } from "../../types/cv";

export default function DetailsToggler({ exp }: DetailsProps) {
  const dispatch = useAppDispatch();
  const cv = useAppSelector((s) => s.cv.cv);

  const index = exp ? "experience" : "education";

  let res = null;

  if (cv) {
    res = (
      <>
        <h3>
          <b>{index.toUpperCase()}</b>
        </h3>
        <ul>
          {cv[index].map((det, i) => {
            const title = "title" in det ? det.title : det.degree;

            const inputId = `cv-detail${exp ? "exp" : "edu"}-${i}`;

            return (
              <li key={i}>
                <input
                  type="checkbox"
                  id={inputId}
                  checked={det.relevant}
                  title={`${
                    det.relevant ? "included in" : "hidden from"
                  } the final printed pdf`}
                  className="no-print clickable"
                  onChange={() => dispatch(toggleRelevance(exp, i))}
                />
                <label htmlFor={inputId} className="clickable">
                  {title} | {det.from} - {det.to}
                </label>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  return res;
}
