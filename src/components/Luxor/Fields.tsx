import { luxorAddField, luxorRmField } from "../../reducers/luxor";
import { useAppDispatch, useAppSelector, useModal } from "../../hooks";

import TableHead from "./TableHead";
import TableBody from "./TableBody";

export default function Fields() {
  const locked = useAppSelector((s) => s.luxor.locked);
  const fields = useAppSelector((s) => s.luxor.fields);
  const dispatch = useAppDispatch();
  const modal = useModal();

  return (
    <ul className="list-none flex flex-wrap pl-0 justify-evenly m-0">
      {fields.map(({ id: fieldId, rows, importedAt }) => (
        <li
          key={fieldId}
          className={`m-2 p-2 text-center ${locked ? "" : " border rounded"}`}
        >
          {!locked && (
            <>
              {importedSpan(importedAt)}
              <div className="flex flex-row-reverse justify-between mb-4">
                <span
                  className="clickable p-4"
                  onClick={() => dispatch(luxorAddField(fieldId))}
                  tabIndex={0}
                >
                  új mező ➕
                </span>
                {fields!.length > 1 && (
                  <span
                    className=" clickable p-4"
                    tabIndex={0}
                    onClick={() =>
                      modal
                        .hu()
                        .ok(() => dispatch(luxorRmField(fieldId)))
                        .cancel()
                        .prompt(<>Azt a mezőt most törlöm...</>)
                    }
                  >
                    🚫 mező törlése
                  </span>
                )}
              </div>
            </>
          )}
          <table className="border-collapse text-2xl">
            <TableHead />
            <TableBody {...{ rows, fieldId }} />
          </table>
        </li>
      ))}
    </ul>
  );
}

function importedSpan(importedAt?: number) {
  let span = null;

  if (importedAt) {
    const SS = (Date.now() - new Date(importedAt).valueOf()) / 1000;
    const MM = SS / 60;
    const HH = MM / 60;
    const DDD = HH / 24;

    const [dtNum, dtStr] = (
      [
        [DDD, "nappal"],
        [HH, "órával"],
        [MM, "perccel"],
        [SS >= 1 ? SS : 1, "másodperccel"],
      ] as [number, string][]
    ).find(([val]) => Math.round(val) > 0)!;

    span = (
      <span className="p-4">
        {Math.round(dtNum)} {dtStr} korábbról
      </span>
    );
  }

  return span;
}
