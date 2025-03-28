import { current, isDraft } from "@reduxjs/toolkit";
import { ReactNode } from "react";

import { db } from "../../db";
import { LuxorFields, LuxorNumbers } from "../../types/db";
import { emptyField, FieldImport } from "../../types/luxor";

const id = "luxor";

export default {
  saveNums: ({ pickedNums }: LuxorNumbers) => {
    db.misc.put({
      id,
      pickedNums: isDraft(pickedNums) ? current(pickedNums) : pickedNums,
    } as LuxorNumbers);
  },

  saveFields: ({ fields }: LuxorFields) => {
    const res = fields.map(({ id, importedAt, order, rows }) => ({
      id,
      importedAt,
      order,
      rows: rows.map((r) => r.map((c) => c)),
    }));

    console.debug("inserting into IDB:", res);

    db.luxorFields.bulkPut(res);
  },

  rmField: (id: number) => {
    db.luxorFields.delete(id);
  },

  load: () => {
    return Promise.all([
      db.misc
        .get(id)
        .then((nums) => (nums ? (nums as LuxorNumbers).pickedNums : [])),

      db.luxorFields.orderBy("order").toArray(),
    ]);
  },
};

export function processImports(
  preset: string | null
): [FieldImport[], ReactNode[], boolean] {
  const prompt = [];
  const res = [];
  let critical = false;
  const invalids = [] as [number, string][];

  if (preset) {
    const importedAt = Date.now();
    const arr = preset.split(",");

    res.push(
      ...arr.reduce((fields, numStr, idx) => {
        const fieldRem = idx % 25;
        const fieldIdx = Math.floor(idx / 25);
        const rowIdx = Math.floor(fieldRem / 5);
        const colIdx = Math.floor(idx % 5);

        if (fieldRem === 0) {
          fields.push({
            rows: emptyField(),
            importedAt,
          });
        }

        const num = Number(numStr);
        if (isNaN(num) || num > 75 || num < 0) {
          invalids.push([idx + 1, numStr]);
        }

        fields[fieldIdx].rows[rowIdx][colIdx] = num;

        return fields;
      }, [] as FieldImport[])
    );

    console.debug("invalid numbers:", invalids);

    if (invalids.length > 0) {
      prompt.push(
        <>
          {(critical = true)}
          {invalids.length === 1 ? (
            <p>
              A {invalids[0][0]}. szám nem jó:{" "}
              <span className="select-text">"{invalids[0][1]}"</span>.
            </p>
          ) : (
            <>
              <p>Az alábbiak nem 0 és 75 közötti számok:</p>
              <ol>
                {invalids.map(([idx, num]) => {
                  return (
                    <li key={idx} value={idx}>
                      "{num}"
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </>
      );
    }

    if (arr.length % 25 !== 0) {
      prompt.push(
        <p>
          25-ösével kell megadni a számokat! A maradékot kipótolom bogarakkal.
          Majd megszerkeszted a lakatra kattintva..
        </p>
      );
    }
  }

  return [res, prompt, critical];
}
