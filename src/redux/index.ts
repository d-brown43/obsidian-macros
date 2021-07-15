import { configureStore } from '@reduxjs/toolkit'
import macro from './macros';

const store = configureStore({
  reducer: {
    macro,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
