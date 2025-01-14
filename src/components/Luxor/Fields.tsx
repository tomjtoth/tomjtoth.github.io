import { useAppSelector } from "../../hooks";
import { Field } from "../../types/luxor";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

export default function Fields() {
  const { locked, fields } = useAppSelector((s) => s.luxor);

  return (
    <ul className="luxor">
      {(fields as Field[]).map(({ id: fieldId, rows, importedAt }) => {
        const deletable = fields.length > 1;

        return (
          <li
            key={fieldId}
            id={fieldId}
            className={`luxor ${locked ? "" : " bordered"}`}
          >
            {!locked && (
              <>
                {importedAt && (
                  <>
                    <span className="luxor-fld-imported padded">
                      {Math.round(
                        (Date.now() - new Date(importedAt).valueOf()) / 1000
                      )}
                      mp-cel korábbról
                    </span>
                  </>
                )}
                <div>
                  <span className="luxor-fld-add clickable padded">
                    új mező ➕
                  </span>
                  {deletable && (
                    <span className="luxor-fld-del clickable padded">
                      🚫 mező törlése
                    </span>
                  )}
                </div>
              </>
            )}
            <table className="luxor">
              <TableHead />
              <TableBody {...{ rows, fieldId }} />
            </table>
          </li>
        );
      })}
    </ul>
  );
}
