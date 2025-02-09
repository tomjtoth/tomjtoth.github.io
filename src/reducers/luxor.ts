import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { EMPTY_FIELD, FieldImport, type State } from "../types/luxor";
import db, { updateFields, numFieldId } from "../services/luxor";
import { maxId } from "../utils";

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
      updateFields(state);

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
        rows: EMPTY_FIELD,
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

export function toggleLock() {
  return (dispatch: AppDispatch) => dispatch(sa.toggleLock());
}

export function saveFields() {
  return (dispatch: AppDispatch) => dispatch(sa.saveFields());
}

export function clearNums() {
  return (dispatch: AppDispatch) => dispatch(sa.clearNums());
}

export function addField(id: string) {
  return (dispatch: AppDispatch) => dispatch(sa.addField(numFieldId(id)));
}

export function rmField(id: string) {
  return (dispatch: AppDispatch) => dispatch(sa.rmField(numFieldId(id)));
}

export function rmLastNum() {
  return (dispatch: AppDispatch) => {
    dispatch(sa.setBugBlur(true));
    dispatch(sa.rmLastNum());
  };
}

export function bugCrawlsTo(x: number | string) {
  return (dispatch: AppDispatch) => dispatch(sa.moveBugTo(x));
}

export function unblurBug() {
  return (dispatch: AppDispatch) => dispatch(sa.setBugBlur(false));
}

export function resetBug() {
  return (dispatch: AppDispatch) => dispatch(sa.resetBug());
}

export default slice.reducer;
