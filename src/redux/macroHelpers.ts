import { createSelector } from '@reduxjs/toolkit';
import { getMacros } from './macros';
import { getOrderedBuiltins } from './builtins';
import { BuiltinMacro, Macro, MacroUnion } from '../types';
import { RootState } from './index';

export const getAllMacros = createSelector<
  RootState,
  Macro[],
  BuiltinMacro[],
  MacroUnion[]
>(getMacros, getOrderedBuiltins, (macros, builtins) => [
  ...builtins,
  ...macros,
]);

export const getMacroIds = createSelector(getAllMacros, (macros) =>
  macros.map((m) => m.id)
);

export const getMacro = (macroId: MacroUnion['id']) =>
  createSelector<RootState, MacroUnion[], MacroUnion | undefined>(
    getAllMacros,
    (macros) => macros.find((macro) => macro.id === macroId)
  );
