import { TableBodyProps } from "../../types/luxor";
import useLuxor from "../../hooks/luxor";
import { between } from "../../utils";

function isValid(num: number, min: number, max: number): boolean {
  return !isNaN(num) && (num === 0 || between(num, min, max));
}

export default function TableBody({ rows, fieldId }: TableBodyProps) {
  const { locked, pickedNums, addNum, update } = useLuxor();

  return (
    <tbody>
      {rows.map((cells, rowIdx) => {
        return (
          <tr key={rowIdx}>
            {cells.map((cell, cellIdx) => {
              const classes = [];
              if (locked) classes.push("clickable");
              if (pickedNums.includes(cell)) classes.push("picked");

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
                    className: classes.join(" "),
                    onClick: () => {
                      if (locked) {
                        if (!pickedNums.includes(cell)) addNum(cell);
                      }
                    },
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
                      min={0}
                      max={max}
                      title={`${min}-${max}`}
                      defaultValue={cell}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        if (isValid(num, min, max))
                          update([fieldId, rowIdx, cellIdx, num]);
                      }}
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
