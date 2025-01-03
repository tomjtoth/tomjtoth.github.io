import { useSelector } from "react-redux";

import TableHead from "./TableHead";
import Row from "./Row";

export default function ({ fieldId, rows, importedAt, deletable }) {
  const { locked } = useSelector((s) => s.luxor);

  return (
    <li id={fieldId} className="bordered luxor">
      {!locked && (
        <>
          {importedAt && (
            <>
              <span className="luxor-fld-imported padded">
                importáltad: {new Date(importedAt).toLocaleString()}
              </span>
              <br />
            </>
          )}
          {deletable && (
            <span className="luxor-fld-del clickable padded">
              🚫 mező törlése
            </span>
          )}
          <span className="luxor-fld-add clickable padded">új mező ➕</span>
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
