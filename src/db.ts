import Dexie, { type EntityTable } from "dexie";
import { MiscData } from "./types/db";

export const db = new Dexie("AppData") as Dexie & {
  misc: EntityTable<MiscData, "id">;
};

db.version(1).stores({
  misc: "id",
});
