import { db } from "../db";
import { LuxorNumbers } from "../types/db";
import { Field, State } from "../types/luxor";
import { current, isDraft } from "@reduxjs/toolkit";

const id = "luxor";

export function save({ pickedNums, fields }: State) {
  db.misc.put({ id, pickedNums: [...pickedNums] } as LuxorNumbers);

  const arr = fields!.map((fld) => (isDraft(fld) ? current(fld)! : fld));

  db.luxorFields.bulkPut(arr);
}

export async function load(fallback: Field[]) {
  return await Promise.all([
    db.misc
      .get(id)
      .then((nums) => (nums ? (nums as LuxorNumbers).pickedNums : [])),

    db.luxorFields
      .orderBy("order")
      .toArray()
      .then((res) => (res.length > 0 ? res : fallback)),
  ]);
}

export function remove(id: number) {
  db.luxorFields.delete(id);
}
