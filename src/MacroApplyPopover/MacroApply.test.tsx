import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import MacroApply from './MacroApply';
import store, { createMacro, selectMacro } from '../redux';
import { Macro } from '../types';
import { resetStoreState } from "../testUtils";

beforeEach(resetStoreState);

it('applies the selected macro immediately if no variables to replace', () => {
  const macro: Macro = {
    id: 'selected-macro-id',
    label: 'my macro',
    text: 'macro text no variables',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  const applyMacro = jest.fn();

  render(
    <Provider store={store}>
      <MacroApply applyMacro={applyMacro} />
    </Provider>
  );

  expect(applyMacro).toHaveBeenCalledWith(macro.text);
});

it('renders inputs for the selected macros variables if some variables', async () => {
  const macro: Macro = {
    id: 'selected-macro-id',
    label: 'my macro',
    text: 'macro text {some} variables {yes}',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  const applyMacro = jest.fn();

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroApply applyMacro={applyMacro} />
    </Provider>
  );

  await act(async () => {
    fireEvent.change(getByTestId('variable-input-yes'), {
      target: {
        value: 'yes variable replacement',
      },
    });

    fireEvent.change(getByTestId('variable-input-some'), {
      target: {
        value: 'some variable replacement',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('variable-input-some') as HTMLInputElement).value
      ).toEqual('some variable replacement');
      expect(
        (getByTestId('variable-input-yes') as HTMLInputElement).value
      ).toEqual('yes variable replacement');
    });

    fireEvent.click(getByTestId('confirm-variables'));
  });

  expect(applyMacro).toHaveBeenCalledWith(
    'macro text some variable replacement variables yes variable replacement'
  );
});
