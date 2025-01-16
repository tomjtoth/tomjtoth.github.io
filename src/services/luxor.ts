import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { LuxorFields, LuxorNumbers } from "../types/db";
import { State } from "../types/luxor";

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
