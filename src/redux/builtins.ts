import {
  BuiltinMacro,
  BuiltinPluginSettings,
  BuiltinSetting,
  BuiltinTypes,
} from '../types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { rehydrate } from "./hydration";

const initialState: BuiltinPluginSettings = {
  currentTime: {
    isEnabled: false,
    type: 'currentTime',
    label: 'Current Time',
  },
};

export const builtinsSlice = createSlice({
  name: 'builtins',
  initialState,
  reducers: {
    setSettingEnabled: (
      state,
      action: PayloadAction<{ [key in keyof BuiltinPluginSettings]: boolean }>
    ) => {
      Object.entries(action.payload).forEach(([key, enabled]) => {
        const typedKey = key as keyof BuiltinPluginSettings;
        state[typedKey].isEnabled = enabled;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(rehydrate, (state, action) => {
      return action.payload.builtins;
    });
  },
});

export const getBuiltins = (state: RootState): BuiltinPluginSettings =>
  state.builtins;

export const getOrderedBuiltins = createSelector<
  RootState,
  BuiltinPluginSettings,
  BuiltinMacro[]
>(getBuiltins, (state) => {
  const macros = Object.entries(state)
    .filter(([, value]) => value.isEnabled)
    .map(([key, value]: [BuiltinTypes, BuiltinSetting<BuiltinTypes>]) => {
      return {
        id: key,
        type: value.type,
        label: value.label,
        text: null,
      };
    });

  return [...macros].sort((macroA, macroB) =>
    macroA.type.localeCompare(macroB.type)
  ) as BuiltinMacro[];
});

export const getIsDatetimeEnabled = createSelector(
  getBuiltins,
  state => state.currentTime.isEnabled
);

export const { setSettingEnabled } = builtinsSlice.actions;

export default builtinsSlice.reducer;
