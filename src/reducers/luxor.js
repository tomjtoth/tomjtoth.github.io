import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject } from "../utils";

function save({ fields, pickedNums, ...state }) {
  storeObject(name, { fields, pickedNums });
  return { fields, pickedNums, ...state };
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
  },
  reducers: {
    pickNumber: ({ pickedNums, ...state }, { payload }) =>
      save({
        ...state,
        pickedNums: pickedNums.concat(payload),
      }),

    setLock: ({ locked, ...state }, { payload }) => ({
      locked: payload === undefined ? !locked : payload,
      ...state,
    }),

    updateFields: ({ fields, ...state }) => {
      const updatedFields = fields.map(({ id, rows }) => {
        return { id, rows: rows.map((row) => [...row]) };
      });

      document
        .querySelectorAll("input.luxor-num")
        .forEach(({ parentNode, value }) => {
          const [_, fieldId, rowIdx, cellIdx] = parentNode.id.match(
            /(.+)-([0-4])-([0-4])$/
          );

          updatedFields.find(({ id }) => id === fieldId).rows[Number(rowIdx)][
            Number(cellIdx)
          ] = Number(value);
        });

      return save({ ...state, fields: updatedFields });
    },

    importFields: ({ fields, ...state }, { payload }) =>
      save({ ...state, fields: fields.concat(...payload) }),

    addEmptyField: ({ fields, ...state }, { payload }) => {
      const idx = fields.findIndex(({ id }) => id === payload);
      const arr = [...fields];

      arr.splice(idx + 1, 0, { id: uuid(), rows: emptyField });

      return save({
        ...state,
        fields: arr,
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
  updateFields,
  resetPickedNumbers,
  addEmptyField,
  removeField,
  importFields,
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

export const saveFields = () => {
  return (dispatch) => {
    dispatch(updateFields());
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

export const fieldsFromPreset = (preset) => {
  return (dispatch) => {
    const importedAt = Date.now();

    dispatch(
      importFields(
        preset.split(",").reduce((fields, numStr, idx) => {
          if (idx % 25 === 0) {
            fields.push({ id: uuid(), rows: [], importedAt });
          }
          const { rows } = fields.last();
          if (idx % 5 === 0) rows.push([]);
          const row = rows.last();

          row.push(Number(numStr));

          return fields;
        }, [])
      )
    );
  };
};

export default slice.reducer;
