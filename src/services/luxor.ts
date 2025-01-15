import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { LuxorFields, LuxorNumbers } from "../types/db";

const id = "luxor";

export default {
  saveNums: ({ pickedNums }: LuxorNumbers) => {
    db.misc.put({ id, pickedNums: current(pickedNums) } as LuxorNumbers);
  },

  saveFields: ({ fields }: LuxorFields) => {
    db.luxorFields.bulkPut(
      fields.map((fld) => (isDraft(fld) ? current(fld) : fld))
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
