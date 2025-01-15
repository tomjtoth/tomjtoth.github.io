import Dexie, { type EntityTable } from "dexie";
import { MiscData } from "./types/db";
import { Field } from "./types/luxor";

export const db = new Dexie("AppData") as Dexie & {
  misc: EntityTable<MiscData, "id">;
  luxorFields: EntityTable<Field, "id">;
};

db.version(1).stores({
  misc: "id",
  luxorFields: "id++, order",
});
