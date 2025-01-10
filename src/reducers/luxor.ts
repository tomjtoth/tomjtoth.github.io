import { v4 as uuid, UUIDTypes } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadObject, storeObject, last } from "../utils";
import { AppDispatch } from "../store";
import type { Field, State } from "../components/Luxor/types";

function save({ locked, bug, ...state }: State) {
  storeObject(name, state);
}

const name = "luxor";

const emptyField = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const slice = createSlice({
  name,
  initialState: {
    ...loadObject(name, {
      fields: [{ id: uuid(), rows: emptyField }],
      pickedNums: [],
    }),
    locked: true,
    bug: {
      x: "110vw",
      privacy: false,
    },
  },
  reducers: {
    pickNumber: (state: State, { payload }: PayloadAction<number>) => {
      state.pickedNums.push(payload);
      save(state);
    },

    setLock: (state: State, { payload }) => {
      state.locked = payload === undefined ? !state.locked : payload;
    },

    updateFields: (state: State) => {
      document
        .querySelectorAll<HTMLInputElement>("input.luxor-num")
        .forEach(({ parentNode, value }) => {
          const [, fieldId, rowIdx, cellIdx] = (
            parentNode! as HTMLElement
          ).id.match(/(.+)-([0-4])-([0-4])$/)!;

          state.fields.find(({ id }) => id === fieldId)!.rows[Number(rowIdx)][
            Number(cellIdx)
          ] = Number(value);
        });

      save(state);
    },

    importFields: (state: State, { payload }) => {
      state.fields.push(...payload);
      save(state);
    },

    addEmptyField: (state: State, { payload }) => {
      const idx = state.fields.findIndex(({ id }) => id === payload);

      state.fields.splice(idx + 1, 0, { id: uuid(), rows: emptyField });

      save(state);
    },

    removeField: (state: State, { payload }) => {
      state.fields = state.fields.filter(({ id }) => id !== payload);
      save(state);
    },

    resetPickedNumbers: (state: State) => {
      state.pickedNums = [];
      save(state);
    },

    removeLastNum: (state: State) => {
      const len = state.pickedNums.length;

      if (len > 0) state.pickedNums.splice(len - 1, 1);

      save(state);
    },

    moveBugTo: (state: State, { payload }) => {
      state.bug = { x: payload, privacy: false, className: "crawling" };
    },

    setPrivacyFilter: (state: State, { payload }: PayloadAction<boolean>) => {
      state.bug!.privacy = payload;
    },

    resetBugState: (state: State) => {
      state.bug = { x: "110vw", privacy: false };
    },
  },
});

const {
  pickNumber,
  setLock,
  updateFields,
  resetPickedNumbers,
  addEmptyField,
  removeField,
  importFields,
  removeLastNum,
  moveBugTo,
  setPrivacyFilter,
  resetBugState,
} = slice.actions;

export const newNumber = (num: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(pickNumber(num));
  };
};

export const toggleEditMode = (to?: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLock(to));
  };
};

export const saveFields = () => {
  return (dispatch: AppDispatch) => {
    dispatch(updateFields());
  };
};

export const resetSelected = () => {
  return (dispatch: AppDispatch) => {
    dispatch(resetPickedNumbers());
  };
};

export const createNewField = (afterId: UUIDTypes) => {
  return (dispatch: AppDispatch) => {
    dispatch(addEmptyField(afterId));
  };
};

export const deleteField = (id: UUIDTypes) => {
  return (dispatch: AppDispatch) => {
    dispatch(removeField(id));
  };
};

export const fieldsFromPreset = (preset: string) => {
  return (dispatch: AppDispatch) => {
    const importedAt = Date.now();

    dispatch(
      importFields(
        preset.split(",").reduce((fields, numStr, idx) => {
          if (idx % 25 === 0) {
            fields.push({ id: uuid(), rows: [], importedAt });
          }
          const { rows } = last(fields) as Field;
          if (idx % 5 === 0) rows.push([]);
          const row = last(rows) as number[];

          row.push(Number(numStr));

          return fields;
        }, [] as Field[])
      )
    );
  };
};

export const undo = () => {
  return (dispatch: AppDispatch) => {
    dispatch(setPrivacyFilter(true));
    dispatch(removeLastNum());
  };
};

export const bugCrawlsTo = (x: number | string) => {
  return (dispatch: AppDispatch) => dispatch(moveBugTo(x));
};

export const bugRemovePrivacy = () => {
  return (dispatch: AppDispatch) => dispatch(setPrivacyFilter(false));
};

export const bugResets = () => {
  return (dispatch: AppDispatch) => dispatch(resetBugState());
};

export default slice.reducer;
