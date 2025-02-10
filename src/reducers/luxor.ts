import { createSlice, current, isDraft, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { EMPTY_FIELD, FieldImport, type State } from "../types/luxor";
import db from "../services/luxor";
import { maxId } from "../utils";

const slice = createSlice({
  name: "luxor",
  initialState: {
    fields: [],
    pickedNums: [],
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

    update: (
      state,
      { payload: [fieldId, rowIdx, cellIdx, num] }: PayloadAction<number[]>
    ) => {
      const field = state.fields.find((f) => f.id === fieldId)!;
      field.rows[rowIdx][cellIdx] = num;
      db.saveFields(state);
    },

    addField: (state, { payload }) => {
      const { order } = state.fields.find((x) => x.id === payload)!;

      state.fields = state.fields.map((f) =>
        f.order > order ? { ...f, order: f.order + 1 } : f
      );

      const id = maxId(state.fields) + 1;
      const newField = {
        id,
        order: order + 1,
        rows: EMPTY_FIELD,
      };

      console.debug(
        "id:",
        id,
        "newField:",
        newField,
        "state.fields:",
        state.fields.map((x) => (isDraft(x) ? current(x) : x))
      );

      state.fields.splice(order, 0, newField);

      // TODO: investigate why adding multiple fields manually trips Dexie error
      db.saveFields(state);
    },

    rmField: (state, { payload }) => {
      const { order } = state.fields.find((f) => f.id === payload)!;

      state.fields = state.fields
        // remove the field
        .filter((f) => f.id !== payload)
        // move the rest of the queue closer
        .map((f) => (f.order > order ? { ...f, order: f.order - 1 } : f));

      db.rmField(payload);
    },

    clearNums: (state) => {
      state.pickedNums = [];
      db.saveNums(state);
    },

    rmLastNum: (state) => {
      const len = state.pickedNums.length;

      if (len > 0) {
        state.pickedNums.pop();
        db.saveNums(state);
      }
    },
  },
});

const sa = slice.actions;

export function init(imports: FieldImport[]) {
  return async (dispatch: AppDispatch) => {
    const [pickedNums, fields] = await db.load();

    if (imports.length > 0) {
      const nextId = maxId(fields) + 1;
      const len = fields.length + 1;
      fields.push(
        ...imports.map((rest, idx) => ({
          ...rest,
          id: nextId + idx,
          order: len + idx,
        }))
      );
      db.saveFields({ fields });
    }

    if (fields.length === 0)
      fields.push({ id: 1, order: 1, rows: EMPTY_FIELD });

    dispatch(sa.init({ pickedNums, fields }));
  };
}

export function addNum(num: number) {
  return (dispatch: AppDispatch) => dispatch(sa.addNum(num));
}

export function update(arr: number[]) {
  return (dispatch: AppDispatch) => dispatch(sa.update(arr));
}

export function clearNums() {
  return (dispatch: AppDispatch) => dispatch(sa.clearNums());
}

export function addField(id: number) {
  return (dispatch: AppDispatch) => dispatch(sa.addField(id));
}

export function rmField(id: number) {
  return (dispatch: AppDispatch) => dispatch(sa.rmField(id));
}

export function rmLastNum() {
  return (dispatch: AppDispatch) => dispatch(sa.rmLastNum());
}

export default slice.reducer;
