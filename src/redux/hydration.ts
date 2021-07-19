import { PluginSettings } from "../types";
import { createAction } from '@reduxjs/toolkit';

export const rehydrate = createAction<PluginSettings>('rehydrate');
