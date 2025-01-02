export default function ({ rowId, cells }) {
  return (
    <tr>
      {cells.map((cell, cellIdx) => {
        const cellId = `${rowId}-${cellIdx}`;

        return (
          <td key={cellId} id={cellId}>
            {locked ? (
              cell === 0 ? (
                "🪲"
              ) : (
                cell
              )
            ) : (
              <input type="number" className="luxor-num" value={cell} />
            )}
          </td>
        );
      })}
    </tr>
  );
}
