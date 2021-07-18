import { Macro } from '../types';
import { createAction } from '@reduxjs/toolkit';

export const rehydrate = createAction<Macro[]>('rehydrate');
