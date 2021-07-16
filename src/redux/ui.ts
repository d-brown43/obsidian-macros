import { createSlice } from "@reduxjs/toolkit";

export type UiState = {
  applyingMacro: boolean;
};

const initialState: UiState = {
  applyingMacro: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openApplyMacro: (state) => {
      state.applyingMacro = true;
    },
    closeApplyMacro: (state) => {
      state.applyingMacro = false;
    },
  },
});

export const { openApplyMacro, closeApplyMacro } = uiSlice.actions;

export default uiSlice.reducer;
