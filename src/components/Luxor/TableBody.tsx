import { TableBodyProps } from "../../types/luxor";
import { lux } from "../../reducers";
import { between } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks";

function isValid(num: number, min: number, max: number): boolean {
  return !isNaN(num) && (num === 0 || between(num, min, max));
}

export default function TableBody({ rows, fieldId }: TableBodyProps) {
  const pickedNums = useAppSelector((s) => s.luxor.pickedNums);
  const locked = useAppSelector((s) => s.luxor.locked);
  const dispatch = useAppDispatch();

  return (
    <tbody className="border-2">
      {rows.map((cells, rowIdx) => {
        return (
          <tr key={rowIdx}>
            {cells.map((cell, cellIdx) => {
              const classes = ["p-1"];
              if (locked) classes.push("clickable");
              if (pickedNums.includes(cell))
                classes.push("bg-red-500 text-white");

              if (locked) {
                if (rowIdx === 1 && between(cellIdx, 1, 3))
                  classes.push("border-t");
                if (rowIdx === 3 && between(cellIdx, 1, 3))
                  classes.push("border-b");
                if (cellIdx === 1 && between(rowIdx, 1, 3))
                  classes.push("border-l");
                if (cellIdx === 3 && between(rowIdx, 1, 3))
                  classes.push("border-r");
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
                        if (!pickedNums.includes(cell))
                          dispatch(lux.addNum(cell));
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
                      className="p-1 w-10"
                      min={0}
                      max={max}
                      title={`${min}-${max}`}
                      defaultValue={cell}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        if (isValid(num, min, max))
                          dispatch(lux.update([fieldId, rowIdx, cellIdx, num]));
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
