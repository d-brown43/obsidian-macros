import { configureStore } from '@reduxjs/toolkit';
import macro from './macros';
import ui from './ui';
import builtins from './builtins';

const store = configureStore({
  reducer: {
    macro,
    ui,
    builtins,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

export * from './hydration';
export * from './macros';
export * from './uiMacros';
export * from './ui';
export * from './builtins';
export * from './macroHelpers';
