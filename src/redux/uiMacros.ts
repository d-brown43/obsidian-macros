import { createSelector } from '@reduxjs/toolkit';
import { getSelectedMacroId } from './ui';
import { getAllMacros } from './macroHelpers';
import { RootState } from './index';
import { MacroUnion } from '../types';

export const getSelectedMacro = createSelector<
  RootState,
  MacroUnion[],
  MacroUnion['id'] | null,
  MacroUnion | null
>(getAllMacros, getSelectedMacroId, (state, selectedMacroId) => {
  if (!selectedMacroId) return null;
  const selectedMacro = state.find((macro) => macro.id === selectedMacroId);
  if (!selectedMacro) return null;
  return selectedMacro;
});
