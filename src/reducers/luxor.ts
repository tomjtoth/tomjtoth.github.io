import { createSlice, current, isDraft, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { emptyField, FieldImport, type State } from "../types/luxor";
import db from "../services/luxor";
import { maxId } from "../utils";

const BUG_DEFAULT = {
  position: "110vw",
  filtered: false,
};

const RICK = new Audio("/rick.mp3");
const SCRATCH = new Audio("/record-scratch.mp3");

RICK.volume = 0.5;
SCRATCH.volume = 0.5;

const slice = createSlice({
  name: "luxor",
  initialState: {
    rick: false,
    loaded: false,
    locked: true,
    bug: BUG_DEFAULT,
    fields: [],
    pickedNums: [],
  } as State,

  reducers: {
    init: (state, { payload }) => ({
      ...state,
      ...payload,
    }),

    setRick: (rs, { payload }) => {
      rs.rick = payload;
    },

    setBug: (rs, { payload }) => {
      rs.bug = payload;
    },

    hideBug: (rs) => {
      rs.bug.filtered = true;
    },

    toggleLocked: (rs) => {
      rs.locked = !rs.locked;
    },

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
        rows: emptyField(),
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

    popNum: (state) => {
      const len = state.pickedNums.length;

      if (len > 0) {
        state.pickedNums.pop();
        db.saveNums(state);
      }
    },
  },
});

const sa = slice.actions;

/**
 * # Thunks of Luxor
 */
export const tLux = {
  init: (imports: FieldImport[]) => {
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
        fields.push({ id: 1, order: 1, rows: emptyField() });

      dispatch(sa.init({ pickedNums, fields, loaded: true }));
    };
  },

  rick: () => async (dispatch: AppDispatch) => {
    if (RICK.paused) {
      dispatch(sa.setRick(true));
      RICK.currentTime = 0;
      RICK.play();

      await new Promise<void>((done) => setTimeout(() => done(), 8500));

      dispatch(sa.setRick(false));
      SCRATCH.currentTime = 0;
      SCRATCH.play();
      RICK.pause();
    }
  },

  addNum: (num: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.addNum(num));
  },

  update: (arr: number[]) => {
    return (dispatch: AppDispatch) => dispatch(sa.update(arr));
  },

  clear: () => {
    return (dispatch: AppDispatch) => dispatch(sa.clearNums());
  },

  addField: (id: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.addField(id));
  },

  rmField: (id: number) => {
    return (dispatch: AppDispatch) => dispatch(sa.rmField(id));
  },

  pop: () => {
    return (dispatch: AppDispatch) => dispatch(sa.popNum());
  },

  toggleLocked: () => {
    return (dispatch: AppDispatch) => dispatch(sa.toggleLocked());
  },

  bugMove: (position: number | string, fast: boolean) => {
    return (dispatch: AppDispatch) =>
      dispatch(
        sa.setBug({ position, filtered: false, transition: fast ? "1s" : "2s" })
      );
  },

  bugHide: () => {
    return (dispatch: AppDispatch) => dispatch(sa.hideBug());
  },

  bugReset: () => {
    return (dispatch: AppDispatch) => dispatch(sa.setBug(BUG_DEFAULT));
  },
};

export default slice.reducer;
