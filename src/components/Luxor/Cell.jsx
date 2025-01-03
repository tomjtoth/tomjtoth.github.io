import { useSelector } from "react-redux";

export default function ({ cellId, cell, rowIdx, cellIdx }) {
  const { locked, pickedNums } = useSelector((s) => s.luxor);

  let className = pickedNums.includes(cell) ? "picked" : "";
  if (locked) {
    if (rowIdx === 1 && cellIdx.between(1, 3)) className += " border1-n";
    if (rowIdx === 3 && cellIdx.between(1, 3)) className += " border1-s";
    if (cellIdx === 1 && rowIdx.between(1, 3)) className += " border1-w";
    if (cellIdx === 3 && rowIdx.between(1, 3)) className += " border1-e";
  }
  if (className === "") className = undefined;

  const min = cellIdx * 15 + 1;
  const max = min + 14;
  return (
    <td {...{ id: cellId, className }}>
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
}
