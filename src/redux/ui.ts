import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Macro, Macro as MacroType } from '../types';
import { RootState } from './index';

export type UiState = {
  applyingMacro: boolean;
  selectedMacroId: null | MacroType['id'];
};

const initialState: UiState = {
  applyingMacro: false,
  selectedMacroId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openApplyMacro: (state) => {
      state.applyingMacro = true;
    },
    closeApplyMacro: (state) => {
      state.applyingMacro = false;
    },
    selectMacro: (state, action: PayloadAction<Macro['id']>) => {
      state.selectedMacroId = action.payload;
    },
    clearSelectedMacro: (state) => {
      state.selectedMacroId = null;
    },
    resetUi: () => initialState,
  },
});

const getSelf = (state: RootState) => state.ui;

export const getSelectedMacroId = createSelector(
  getSelf,
  (state) => state.selectedMacroId
);

export const { openApplyMacro, closeApplyMacro, selectMacro, resetUi } =
  uiSlice.actions;

export default uiSlice.reducer;
