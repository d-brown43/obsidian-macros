import { createSelector } from "@reduxjs/toolkit";
import { getSelectedMacroId } from "./ui";
import { getMacros } from "./macros";

export const getSelectedMacro = createSelector(
  getMacros,
  getSelectedMacroId,
  (state, selectedMacroId) => {
    if (!selectedMacroId) return null;
    const selectedMacro = state.find((macro) => macro.id === selectedMacroId);
    if (!selectedMacro) return null;
    return selectedMacro;
  }
);
