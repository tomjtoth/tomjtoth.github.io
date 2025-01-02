import TableHead from "./TableHead";
import Row from "./Row";

export default function ({ fieldId, rows, locked, deletable }) {
  return (
    <li>
      {deletable && <span>&times;</span>}
      <span>ADD</span>
      <table>
        <TableHead />
        <tbody>
          {rows.map((cells, rowIdx) => {
            const rowId = `${fieldId}-${rowIdx}`;
            <Row key={rowId} {...{ rowId, cells, locked }} />;
          })}
        </tbody>
      </table>
    </li>
  );
}
