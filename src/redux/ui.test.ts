import {
  clearSelectedMacro,
  closeApplyMacro,
  getIsApplyingMacro,
  getSelectedMacroId,
  openApplyMacro,
  selectMacro
} from "./ui";
import store, { createMacro, deleteMacro } from './index';
import { Macro } from '../types';
import { resetStoreState } from '../testUtils';

afterEach(resetStoreState);

it('toggles if applying macro', () => {
  expect(getIsApplyingMacro(store.getState())).toEqual(false);
  store.dispatch(openApplyMacro());
  expect(getIsApplyingMacro(store.getState())).toEqual(true);
  store.dispatch(closeApplyMacro());
  expect(getIsApplyingMacro(store.getState())).toEqual(false);
});

it('clears the selected macro if it is deleted', () => {
  const macro: Macro = {
    label: 'macro',
    text: 'macro',
    id: 'macro-id',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  expect(getSelectedMacroId(store.getState())).toEqual('macro-id');

  store.dispatch(deleteMacro(macro.id));

  expect(getSelectedMacroId(store.getState())).toBeNull();
});

it('clears the selected macro', () => {
  const macro: Macro = {
    label: 'macro',
    text: 'macro',
    id: 'macro-id',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  expect(getSelectedMacroId(store.getState())).toEqual('macro-id');

  store.dispatch(clearSelectedMacro());

  expect(getSelectedMacroId(store.getState())).toBeNull();
});
