import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import type { Field, State } from "../types/luxor";
import db from "../services/luxor";
import { last, maxId } from "../utils";

const emptyField = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
const bug = {
  x: "110vw",
  privacy: false,
};

const slice = createSlice({
  name: "luxor",
  initialState: {
    fields: [],
    pickedNums: [],
    locked: true,
    bug,
  } as State,

  reducers: {
    init: (state, { payload }) => ({
      ...state,
      ...payload,
    }),

    addNum: (state, { payload }: PayloadAction<number>) => {
      state.pickedNums.push(payload);
      db.saveNums(state);
    },

    toggleLock: (state) => {
      state.locked = !state.locked;
    },

    saveFields: (state) => {
      document
        .querySelectorAll<HTMLInputElement>("input.luxor-num")
        .forEach(({ id, value }) => {
          const [, fieldIdStr, rowIdxStr, cellIdxStr] = id.match(
            /(\d+)-([0-4])-([0-4])$/
          )!;

          state.fields.find(({ id }) => id === Number(fieldIdStr))!.rows[
            Number(rowIdxStr)
          ][Number(cellIdxStr)] = Number(value);
        });

      db.saveFields(state);
    },

    addField: (state, { payload }) => {
      const { order } = state.fields.find((x) => x.id === payload)!;

      state.fields = state.fields.map((field) =>
        field.order > order ? { ...field, order: field.order + 1 } : field
      );

      state.fields.splice(order, 0, {
        id: maxId(state.fields) + 1,
        order: order + 1,
        rows: emptyField,
      });

      db.saveFields(state);
    },

    rmField: (state, { payload }) => {
      const { order } = state.fields.find((fld) => fld.id === payload)!;

      state.fields = state.fields
        // remove the field
        .filter(({ id }) => id !== payload)
        // move the rest of the queue closer
        .map((field) =>
          field.order > order ? { ...field, order: field.order - 1 } : field
        );

      db.rmField(payload);
    },

    clearNums: (state) => {
      state.pickedNums = [];
      db.saveNums(state);
    },

    rmLastNum: (state) => {
      const len = state.pickedNums.length;

      if (len > 0) {
        state.pickedNums.splice(len - 1, 1);
        db.saveNums(state);
      }
    },

    moveBugTo: (state, { payload }) => {
      state.bug = { x: payload, privacy: false, className: "crawling" };
    },

    setBugBlur: (state, { payload }: PayloadAction<boolean>) => {
      state.bug.privacy = payload;
    },

    resetBug: (state) => {
      state.bug = bug;
    },
  },
});

const act = slice.actions;

export function init(preset: string | null) {
  return async (dispatch: AppDispatch) => {
    const [pickedNums, fields] = await db.load();

    if (preset) {
      const importedAt = Date.now();
      const nextId = maxId(fields) + 1;
      const fieldsLength = fields.length;

      fields.push(
        ...preset.split(",").reduce((fields, numStr, idx) => {
          if (idx % 25 === 0) {
            const id = nextId + Math.floor(idx / 25);
            fields.push({ id, order: fieldsLength + id, rows: [], importedAt });
          }
          const { rows } = last(fields) as Field;
          if (idx % 5 === 0) rows.push([]);
          const row = last(rows) as number[];

          row.push(Number(numStr));

          return fields;
        }, [] as Field[])
      );

      db.saveFields({ fields });
    }

    if (fields.length === 0) fields.push({ id: 1, order: 1, rows: emptyField });

    dispatch(act.init({ pickedNums, fields }));
  };
}

export function addNum(num: number) {
  return (dispatch: AppDispatch) => dispatch(act.addNum(num));
}

export function toggleLock() {
  return (dispatch: AppDispatch) => dispatch(act.toggleLock());
}

export function saveFields() {
  return (dispatch: AppDispatch) => dispatch(act.saveFields());
}

export function clearNums() {
  return (dispatch: AppDispatch) => dispatch(act.clearNums());
}

export function addField(id: number) {
  return (dispatch: AppDispatch) => dispatch(act.addField(id));
}

export function rmField(id: number) {
  return (dispatch: AppDispatch) => dispatch(act.rmField(id));
}

export function rmLastNum() {
  return (dispatch: AppDispatch) => {
    dispatch(act.setBugBlur(true));
    dispatch(act.rmLastNum());
  };
}

export function bugCrawlsTo(x: number | string) {
  return (dispatch: AppDispatch) => dispatch(act.moveBugTo(x));
}

export function unblurBug() {
  return (dispatch: AppDispatch) => dispatch(act.setBugBlur(false));
}

export function resetBug() {
  return (dispatch: AppDispatch) => dispatch(act.resetBug());
}

export default slice.reducer;
