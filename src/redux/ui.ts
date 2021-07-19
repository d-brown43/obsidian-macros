import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MacroUnion } from '../types';
import { RootState } from './index';
import { deleteMacro } from './macros';

export type UiState = {
  applyingMacro: boolean;
  selectedMacroId: null | MacroUnion['id'];
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
    selectMacro: (state, action: PayloadAction<MacroUnion['id']>) => {
      state.selectedMacroId = action.payload;
    },
    clearSelectedMacro: (state) => {
      state.selectedMacroId = null;
    },
    resetUi: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteMacro, (state, action) => {
      if (state.selectedMacroId === action.payload) {
        state.selectedMacroId = null;
      }
    });
  },
});

const getSelf = (state: RootState) => state.ui;

export const getSelectedMacroId = createSelector<RootState, UiState, MacroUnion['id'] | null>(
  getSelf,
  (state) => state.selectedMacroId
);

export const getIsMacroSelected = createSelector(
  getSelectedMacroId,
  (macroId) => macroId !== null
);

export const getIsApplyingMacro = createSelector(
  getSelf,
  (state) => state.applyingMacro
);

export const {
  openApplyMacro,
  closeApplyMacro,
  selectMacro,
  resetUi,
  clearSelectedMacro,
} = uiSlice.actions;

export default uiSlice.reducer;
