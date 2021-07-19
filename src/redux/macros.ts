import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Macro } from '../types';
import { rehydrate } from './hydration';
import { getMacro, RootState } from "./index";

export type MacroState = Macro[];

const initialState: MacroState = [];

export const macroSlice = createSlice({
  name: 'macro',
  initialState,
  reducers: {
    createMacro: (
      state,
      action: PayloadAction<Omit<Macro, 'id'> & { id?: Macro['id'] }>
    ) => {
      state.push({
        id: uuidv4(),
        ...action.payload,
      });
    },
    updateMacro: (state, action: PayloadAction<Macro>) => {
      state.forEach((macro) => {
        if (macro.id === action.payload.id) {
          Object.assign(macro, action.payload);
        }
      });
    },
    deleteMacro: (state, action: PayloadAction<Macro['id']>) => {
      return state.filter((macro) => macro.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(rehydrate, (state, action) => {
      return action.payload.macros;
    });
  },
});

export const getMacros = (state: RootState) => state.macro;

export const getTextMacroIds = createSelector(
  getMacros,
  macros => macros.map(m => m.id),
);

export const { createMacro, updateMacro, deleteMacro } = macroSlice.actions;

export default macroSlice.reducer;
