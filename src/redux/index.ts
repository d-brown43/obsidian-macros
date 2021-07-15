import { configureStore } from '@reduxjs/toolkit'
import macro from './macros';
import ui from './ui';

const store = configureStore({
  reducer: {
    macro,
    ui,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
