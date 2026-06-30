import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const { id, message, type = "info" } = action.payload;
      state.toasts.push({ id, message, type });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

// Redux Thunk action to automatically remove the toast after 4000ms
export const showToast = (message, type = "info") => (dispatch) => {
  const id = Math.random().toString(36).substring(2, 9);
  dispatch(addToast({ id, message, type }));
  setTimeout(() => {
    dispatch(removeToast(id));
  }, 4000);
};

export default toastSlice.reducer;
