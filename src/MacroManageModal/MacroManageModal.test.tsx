import {
  act,
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import store, { createMacro, getMacro, getMacros } from '../redux';
import { resetStoreState } from '../testUtils';
import MacroManageModal from './MacroManageModal';

beforeEach(resetStoreState);

const setupMacros = () => {
  store.dispatch(
    createMacro({
      id: 'test-macro-1',
      text: 'macro-1-macro',
      label: 'macro-1-label',
    })
  );

  store.dispatch(
    createMacro({
      id: 'test-macro-2',
      text: 'macro-2-macro',
      label: 'macro-2-label',
    })
  );
};

it('renders no macro notice if no macros exist', () => {
  const { queryByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  expect(queryByTestId('no-macros-notice')).not.toBeNull();
});

it('allows creating a macro', async () => {
  const { queryByTestId, getByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  expect(queryByTestId('no-macros-notice')).not.toBeNull();

  act(() => {
    fireEvent.click(getByTestId('create-macro'));
  });

  await waitFor(() => {
    expect(getMacros(store.getState()).length).toEqual(1);
    expect(queryByTestId('no-macros-notice')).toBeNull();
  });
});

it('renders the macros in state', () => {
  setupMacros();

  const { queryByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  expect(queryByTestId('edit-macro-test-macro-1')).not.toBeNull();
  expect(queryByTestId('edit-macro-test-macro-2')).not.toBeNull();
});

it('allows updating a macro', async () => {
  setupMacros();

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  await act(async () => {
    fireEvent.change(getByTestId('edit-macro-label-test-macro-1'), {
      target: {
        value: 'updated macro 1 label',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('edit-macro-label-test-macro-1') as HTMLInputElement).value
      ).toEqual('updated macro 1 label');
    });

    fireEvent.click(getByTestId('edit-macro-confirm-test-macro-1'));
  });

  await waitFor(() => {
    const macro = getMacro('test-macro-1')(store.getState());
    expect(macro?.label).toEqual('updated macro 1 label');
    expect(macro?.text).toEqual('macro-1-macro');
  });

  await act(async () => {
    fireEvent.change(getByTestId('edit-macro-pattern-test-macro-2'), {
      target: {
        value: 'updated {variable} macro',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('edit-macro-pattern-test-macro-2') as HTMLInputElement)
          .value
      ).toEqual('updated {variable} macro');
    });

    fireEvent.click(getByTestId('edit-macro-confirm-test-macro-2'));
  });

  await waitFor(() => {
    const macro = getMacro('test-macro-2')(store.getState());
    expect(macro?.label).toEqual('macro-2-label');
    expect(macro?.text).toEqual('updated {variable} macro');
  });
});

it('allows deleting macros', async () => {
  setupMacros();

  expect(getMacros(store.getState()).length).toEqual(2);

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  act(() => {
    fireEvent.click(getByTestId('delete-macro-test-macro-1'));
  });

  await waitFor(() => {
    expect(getMacros(store.getState()).length).toEqual(1);
    expect(getMacro('test-macro-2')(store.getState())).not.toBeNull();
  });
});

it('uses the macro pattern as a label if no macro label input after trimming', async () => {
  setupMacros();

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  await act(async () => {
    fireEvent.change(getByTestId('edit-macro-label-test-macro-1'), {
      target: {
        value: ' ',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('edit-macro-label-test-macro-1') as HTMLInputElement).value
      ).toEqual(' ');
    });

    fireEvent.click(getByTestId('edit-macro-confirm-test-macro-1'));
  });

  await waitFor(() => {
    expect(getMacro('test-macro-1')(store.getState())?.label).toEqual('macro-1-macro');
  });
});

it('uses the default macro label if no macro pattern or label', async () => {
  setupMacros();

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroManageModal />
    </Provider>
  );

  await act(async () => {
    fireEvent.change(getByTestId('edit-macro-label-test-macro-1'), {
      target: {
        value: '',
      },
    });

    fireEvent.change(getByTestId('edit-macro-pattern-test-macro-1'), {
      target: {
        value: '',
      }
    });

    await waitFor(() => {
      expect(
        (getByTestId('edit-macro-label-test-macro-1') as HTMLInputElement).value
      ).toEqual('');
      expect(
        (getByTestId('edit-macro-pattern-test-macro-1') as HTMLInputElement).value
      ).toEqual('');
    });

    fireEvent.click(getByTestId('edit-macro-confirm-test-macro-1'));
  });

  await waitFor(() => {
    expect(getMacro('test-macro-1')(store.getState())?.label).toEqual('Macro Label');
    expect(getMacro('test-macro-1')(store.getState())?.text).toEqual('');
  });
});
