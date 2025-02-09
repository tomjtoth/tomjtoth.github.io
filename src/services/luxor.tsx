import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { LuxorFields, LuxorNumbers } from "../types/db";
import { EMPTY_FIELD, FieldImport, State } from "../types/luxor";
import { ReactNode } from "react";

const id = "luxor";

export default {
  saveNums: ({ pickedNums }: LuxorNumbers) => {
    db.misc.put({
      id,
      pickedNums: isDraft(pickedNums) ? current(pickedNums) : pickedNums,
    } as LuxorNumbers);
  },

  saveFields: ({ fields }: LuxorFields) => {
    db.luxorFields.bulkPut(
      fields.map((field) => (isDraft(field) ? current(field) : field))
    );
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

const re = {
  allIds: /(\d+)-(\d)-(\d)$/,
  fieldId: /\d+/,
};

export function numFieldId(idStr: string) {
  const [id] = idStr.match(re.fieldId)!;
  return Number(id);
}

export function updateFields(state: State) {
  document
    .querySelectorAll<HTMLInputElement>("input.luxor-num")
    .forEach(({ id, value }) => {
      const [, fieldIdStr, rowIdxStr, cellIdxStr] = id.match(re.allIds)!;

      state.fields.find(({ id }) => id === Number(fieldIdStr))!.rows[
        Number(rowIdxStr)
      ][Number(cellIdxStr)] = Number(value);
    });
}

export function processImports(
  preset: String | null
): [FieldImport[], ReactNode | null, boolean] {
  let prompt = null;
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
            rows: EMPTY_FIELD,
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

    prompt = invalids.length > 0 && (
      <>
        {(critical = true)}
        {invalids.length === 1 ? (
          <p>
            A {invalids[0][0]}. szám nem jó:{" "}
            <span style={{ userSelect: "text" }}>"{invalids[0][1]}"</span>.
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
        {arr.length % 25 !== 0 && (
          <p>
            25-ösével kell megadni a számokat! A maradékot kipótolom bogarakkal.
            " "Majd megszerkeszted a lakatra kattintva..
          </p>
        )}
      </>
    );
  }

  return [res, prompt, critical];
}
