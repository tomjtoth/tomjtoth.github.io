import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";

function save({ fields, ...state }) {
  storeObject(name, { fields });
  return { fields, ...state };
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
    ...loadObject(name, { fields: [{ id: uuid(), rows: emptyField }] }),
    locked: true,
    pickedNums: [],
  },
  reducers: {
    pickNumber: ({ pickedNums, ...state }, { payload }) => ({
      ...state,
      pickedNums: pickedNums.concat(payload),
    }),

    setLock: ({ locked, ...state }, { payload }) => ({
      locked: payload === undefined ? !locked : payload,
      ...state,
    }),

    storeFields: ({ fields, ...state }, { payload }) =>
      save({ ...state, fields: payload }),

    addEmptyField: ({ fields, ...state }, { payload }) => {
      const idx = fields.indexOf(payload);
      const arr = [...fields];

      arr.splice(idx + 1, 0, { id: uuid(), rows: emptyField });

      return save({
        fields: arr,
        ...state,
      });
    },

    removeField: ({ fields, ...state }, { payload }) =>
      save({
        ...state,
        fields: fields.filter(({ id }) => id !== payload),
      }),

    resetPickedNumbers: (state) => ({ ...state, pickedNums: [] }),
  },
});

const {
  pickNumber,
  setLock,
  storeFields,
  resetPickedNumbers,
  addEmptyField,
  removeField,
} = slice.actions;

export const newNumber = (num) => {
  return (dispatch) => {
    dispatch(pickNumber(num));
  };
};

export const toggleEditMode = (to) => {
  return (dispatch) => {
    dispatch(setLock(to));
  };
};

export const saveFields = (fields) => {
  return (dispatch) => {
    dispatch(storeFields(fields));
  };
};

export const resetSelected = () => {
  return (dispatch) => {
    dispatch(resetPickedNumbers());
  };
};

export const createNewField = (afterId) => {
  return (dispatch) => {
    dispatch(addEmptyField(afterId));
  };
};

export const deleteField = (id) => {
  return (dispatch) => {
    dispatch(removeField(id));
  };
};

export default slice.reducer;
