import { act, fireEvent, getByTestId, render } from '@testing-library/react';
import store, { createMacro, getSelectedMacroId } from '../redux';
import { Provider } from 'react-redux';
import MacroList from './MacroList';
import { Macro } from '../types';
import { resetStoreState } from '../testUtils';

beforeEach(resetStoreState);

it('renders a selectable list of macros', () => {
  const macros: Macro[] = [
    {
      id: 'macro-id-1',
      label: 'macro 1',
      text: 'macro 1',
    },
    {
      id: 'macro-id-2',
      label: 'macro 2',
      text: 'macro 2',
    },
  ];

  macros.forEach((m) => store.dispatch(createMacro(m)));

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroList />
    </Provider>
  );

  act(() => {
    fireEvent.click(getByTestId('macro-item-macro-id-1'));
  });

  expect(getSelectedMacroId(store.getState())).toEqual('macro-id-1');

  act(() => {
    fireEvent.click(getByTestId('macro-item-macro-id-2'));
  });

  expect(getSelectedMacroId(store.getState())).toEqual('macro-id-2');
});
