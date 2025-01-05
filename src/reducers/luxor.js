import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { loadObject, storeObject, last } from "../utils";

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
          const [, fieldId, rowIdx, cellIdx] = parentNode.id.match(
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

    resetPickedNumbers: (state) => save({ ...state, pickedNums: [] }),

    removeLastNum: ({ pickedNums, ...state }) => {
      const len = pickedNums.length;

      const arr = len > 0 ? pickedNums.slice(0, len - 1) : pickedNums;

      return save({ ...state, pickedNums: arr });
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
          const { rows } = last(fields);
          if (idx % 5 === 0) rows.push([]);
          const row = last(rows);

          row.push(Number(numStr));

          return fields;
        }, [])
      )
    );
  };
};

export const undo = () => {
  return (dispatch) => {
    dispatch(removeLastNum());
  };
};

export default slice.reducer;
