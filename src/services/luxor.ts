import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { LuxorNumbers } from "../types/db";
import { State } from "../types/luxor";

const id = "luxor";

export function save({
  pickedNums,
  fields,
}: Pick<State, "fields" | "pickedNums">) {
  db.misc.put({ id, pickedNums: [...pickedNums] } as LuxorNumbers);

  db.luxorFields.bulkPut(
    fields!.map((fld) => (isDraft(fld) ? current(fld)! : fld))
  );
}

export function load() {
  return Promise.all([
    db.misc
      .get(id)
      .then((nums) => (nums ? (nums as LuxorNumbers).pickedNums : [])),

    db.luxorFields.orderBy("order").toArray(),
  ]);
}

export function remove(id: number) {
  db.luxorFields.delete(id);
}
