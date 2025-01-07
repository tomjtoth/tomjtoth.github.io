import Cell from "./Cell";

export default function Row({ rowId, cells, rowIdx }) {
  return (
    <tr>
      {cells.map((cell, cellIdx) => {
        const cellId = `${rowId}-${cellIdx}`;

        return <Cell key={cellId} {...{ cell, cellId, rowIdx, cellIdx }} />;
      })}
    </tr>
  );
}
