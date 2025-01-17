import { TableBodyProps } from "../../types/luxor";
import { useAppSelector } from "../../hooks";
import { between } from "../../utils";

export default function TableBody({ rows, fieldId }: TableBodyProps) {
  const { locked, pickedNums } = useAppSelector((s) => s.luxor);

  return (
    <tbody>
      {rows.map((cells, rowIdx) => {
        return (
          <tr key={rowIdx}>
            {cells.map((cell, cellIdx) => {
              const cellId = `luxor-${fieldId}-${rowIdx}-${cellIdx}`;

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
                  key={cellIdx}
                  {...{
                    id: locked ? cellId : undefined,
                    className: classes.join(" "),
                  }}
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
                      id={cellId}
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
