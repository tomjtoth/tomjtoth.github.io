import { useSelector } from "react-redux";

import TableHead from "./TableHead";
import Row from "./Row";

export default function ({ fieldId, rows, importedAt, deletable }) {
  const { locked } = useSelector((s) => s.luxor);

  return (
    <li id={fieldId} className={`luxor ${locked ? "" : " bordered"}`}>
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
            <span className="luxor-fld-add clickable padded">új mező ➕</span>
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
        <tbody>
          {rows.map((cells, rowIdx) => {
            const rowId = `${fieldId}-${rowIdx}`;
            return <Row key={rowId} {...{ rowId, cells, rowIdx }} />;
          })}
        </tbody>
      </table>
    </li>
  );
}
