import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import type { Field, State } from "../types/luxor";
import { load, remove, save } from "../services/luxor";
import { last } from "../utils";

const emptyField = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const slice = createSlice({
  name: "luxor",
  initialState: {
    pickedNums: [],
    locked: true,
    bug: {
      x: "110vw",
      privacy: false,
    },
  } as State,
  reducers: {
    init: (state, { payload }) => ({ ...state, ...payload }),

    pickNumber: (state, { payload }: PayloadAction<number>) => {
      state.pickedNums.push(payload);
      save(state);
    },

    setLock: (state, { payload }) => {
      state.locked = payload === undefined ? !state.locked : payload;
    },

    updateFields: (state) => {
      document
        .querySelectorAll<HTMLInputElement>("input.luxor-num")
        .forEach(({ id, value }) => {
          const [, fieldIdStr, rowIdxStr, cellIdxStr] = id.match(
            /(\d+)-([0-4])-([0-4])$/
          )!;

          state.fields!.find(({ id }) => id === Number(fieldIdStr))!.rows[
            Number(rowIdxStr)
          ][Number(cellIdxStr)] = Number(value);
        });

      save(state);
    },

    addEmptyField: (state, { payload }) => {
      const { order } = state.fields!.find((x) => x.id === payload)!;

      state.fields = state.fields!.map((field) =>
        field.order > order ? { ...field, order: field.order + 1 } : field
      );

      state.fields.splice(order, 0, {
        id: Math.max(0, ...state.fields!.map((field) => field.id)) + 1,
        order: order + 1,
        rows: emptyField,
      });

      save(state);
    },

    rmField: (state, { payload }) => {
      const { order } = state.fields!.find((fld) => fld.id === payload)!;

      state.fields = state
        // remove the field
        .fields!.filter(({ id }) => id !== payload)
        // move the rest of the queue closer
        .map((field) =>
          field.order > order ? { ...field, order: field.order - 1 } : field
        );

      remove(payload);
    },

    resetPickedNumbers: (state) => {
      state.pickedNums = [];
      save(state);
    },

    removeLastNum: (state) => {
      const len = state.pickedNums.length;

      if (len > 0) {
        state.pickedNums.splice(len - 1, 1);
        save(state);
      }
    },

    moveBugTo: (state, { payload }) => {
      state.bug = { x: payload, privacy: false, className: "crawling" };
    },

    setPrivacyFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.bug!.privacy = payload;
    },

    resetBugState: (state) => {
      state.bug = { x: "110vw", privacy: false };
    },
  },
});

const {
  init,
  pickNumber,
  setLock,
  updateFields,
  resetPickedNumbers,
  addEmptyField,
  rmField,
  removeLastNum,
  moveBugTo,
  setPrivacyFilter,
  resetBugState,
} = slice.actions;

export function initLuxor(preset: string | null) {
  return async (dp: AppDispatch) => {
    const [pickedNums, fields] = await load();

    if (preset) {
      const importedAt = Date.now();
      const nextId = Math.max(0, ...fields.map((field) => field.id)) + 1;
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

      save({ pickedNums, fields });
    }

    if (fields.length === 0) fields.push({ id: 1, order: 1, rows: emptyField });

    dp(init({ pickedNums, fields }));
  };
}

export function newNumber(num: number) {
  return (dispatch: AppDispatch) => dispatch(pickNumber(num));
}

export function toggleEditMode(to?: boolean) {
  return (dispatch: AppDispatch) => dispatch(setLock(to));
}

export const saveFields = () => {
  return (dispatch: AppDispatch) => dispatch(updateFields());
};

export const resetSelected = () => {
  return (dispatch: AppDispatch) => dispatch(resetPickedNumbers());
};

export function createNewField(afterId: number) {
  return (dispatch: AppDispatch) => dispatch(addEmptyField(afterId));
}

export function removeField(id: number) {
  return (dispatch: AppDispatch) => dispatch(rmField(id));
}

export const undo = () => {
  return (dispatch: AppDispatch) => {
    dispatch(setPrivacyFilter(true));
    dispatch(removeLastNum());
  };
};

export function bugCrawlsTo(x: number | string) {
  return (dispatch: AppDispatch) => dispatch(moveBugTo(x));
}

export const bugRemovePrivacy = () => {
  return (dispatch: AppDispatch) => dispatch(setPrivacyFilter(false));
};

export const bugResets = () => {
  return (dispatch: AppDispatch) => dispatch(resetBugState());
};

export default slice.reducer;
