import { TableBodyProps } from "./types";
import { useAppSelector } from "../../hooks";
import { between } from "../../utils";

export default function TableBody({ rows, fieldId }: TableBodyProps) {
  const { locked, pickedNums } = useAppSelector((s) => s.luxor);

  return (
    <tbody>
      {rows.map((cells, rowIdx) => {
        const rowId = `${fieldId}-${rowIdx}`;

        return (
          <tr key={rowId}>
            {cells.map((cell, cellIdx) => {
              const cellId = `${rowId}-${cellIdx}`;

              const classes = [];
              if (locked) classes.push("clickable");
              if ((pickedNums as number[]).includes(cell))
                classes.push("picked");

              if (locked) {
                if (rowIdx === 1 && between(cellIdx, 1, 3))
                  classes.push("border1-n");
                if (rowIdx === 3 && between(cellIdx, 1, 3))
                  classes.push("border1-s");
                if (cellIdx === 1 && between(rowIdx, 1, 3))
                  classes.push("border1-w");
                if (cellIdx === 3 && between(rowIdx, 1, 3))
                  classes.push("border1-e");
              }

              const min = cellIdx * 15 + 1;
              const max = min + 14;
              return (
                <td
                  key={cellId}
                  {...{ id: cellId, className: classes.join(" ") }}
                >
                  {locked ? (
                    cell === 0 ? (
                      "🪲"
                    ) : (
                      cell
                    )
                  ) : (
                    <input
                      type="number"
                      className="luxor-num"
                      min="0"
                      max={max}
                      defaultValue={cell}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
