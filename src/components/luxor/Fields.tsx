import { useAppSelector } from "../../hooks";
import { Field } from "../../types/luxor";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

export default function Fields() {
  const { locked, fields } = useAppSelector((s) => s.luxor);

  return (
    <ul className="luxor">
      {(fields as Field[]).map(({ id: fieldId, rows, importedAt }) => {
        const deletable = fields!.length > 1;

        let importedSpan = null;

        if (importedAt) {
          const SS = (Date.now() - new Date(importedAt).valueOf()) / 1000;
          const MM = SS / 60;
          const HH = MM / 60;
          const DDD = HH / 24;

          const [dtNum, dtStr] = (
            [
              [DDD, "nappal"],
              [HH, "órával"],
              [MM, "perccel"],
              [SS, "másodperccel"],
            ] as [number, string][]
          ).find(([val]) => Math.round(val) > 0)!;

          importedSpan = (
            <span className="luxor-fld-imported padded">
              {Math.round(dtNum)} {dtStr} korábbról
            </span>
          );
        }

        return (
          <li
            key={fieldId}
            id={`luxor-${fieldId}`}
            className={`luxor ${locked ? "" : " bordered"}`}
          >
            {!locked && (
              <>
                {importedSpan}
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
