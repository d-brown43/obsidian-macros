import { BuiltinMacro, Macro, MacroUnion } from "../types";

export * from './manipulateMacros';
export * from './observeStore';

export const isTextMacro = (macro: MacroUnion): macro is Macro =>
  typeof (macro as BuiltinMacro).type === 'undefined';

export const isBuiltinMacro = (macro: MacroUnion): macro is BuiltinMacro =>
  typeof (macro as BuiltinMacro).type !== 'undefined';
