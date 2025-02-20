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
    <ul className="luxor">
      {fields.map(({ id: fieldId, rows, importedAt }) => (
        <li key={fieldId} className={`luxor ${locked ? "" : " bordered"}`}>
          {!locked && (
            <>
              {importedSpan(importedAt)}
              <div>
                <span
                  className="clickable padded"
                  onClick={() => dispatch(luxorAddField(fieldId))}
                  tabIndex={0}
                >
                  új mező ➕
                </span>
                {fields!.length > 1 && (
                  <span
                    className=" clickable padded"
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
          <table className="luxor">
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
      <span className="padded">
        {Math.round(dtNum)} {dtStr} korábbról
      </span>
    );
  }

  return span;
}
