import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import MacroApply from './MacroApply';
import store, { createMacro, selectMacro } from '../redux';
import { Macro } from '../types';
import { resetStoreState } from '../testUtils';

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
      <MacroApply
        applyMacro={applyMacro}
        back={jest.fn()}
        renderIntoTitle={jest.fn()}
      />
    </Provider>
  );

  expect(applyMacro).toHaveBeenCalledWith(macro.text);
  expect(applyMacro).toHaveBeenCalledTimes(1);
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
      <MacroApply
        applyMacro={applyMacro}
        back={jest.fn()}
        renderIntoTitle={jest.fn()}
      />
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

it('allows rendering a preview of the macro', async () => {
  const macro: Macro = {
    id: 'selected-macro-id',
    label: 'my macro',
    text: 'macro text {variable}',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  const applyMacro = jest.fn();
  const renderIntoTitle = (element: JSX.Element) => element;

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroApply
        applyMacro={applyMacro}
        back={jest.fn()}
        renderIntoTitle={renderIntoTitle}
      />
    </Provider>
  );

  expect(getByTestId('apply-preview-result').textContent).toEqual(
    'macro text {variable}'
  );

  await act(async () => {
    fireEvent.change(getByTestId('variable-input-variable'), {
      target: {
        value: 'inserted content',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('variable-input-variable') as HTMLInputElement).value
      ).toEqual('inserted content');
    });

    expect(getByTestId('apply-preview-result').textContent).toEqual(
      'macro text inserted content'
    );
  });
});

it('only submits when all variables have a value entered', async () => {
  const macro: Macro = {
    id: 'selected-macro-id',
    label: 'my macro',
    text: 'macro text {variable}',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  const applyMacro = jest.fn();
  const renderIntoTitle = (element: JSX.Element) => element;

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroApply
        applyMacro={applyMacro}
        back={jest.fn()}
        renderIntoTitle={renderIntoTitle}
      />
    </Provider>
  );

  await act(async () => {
    fireEvent.click(getByTestId('confirm-variables'));

    expect(applyMacro).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('variable-input-variable'), {
      target: {
        value: 'content',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('variable-input-variable') as HTMLInputElement).value
      ).toEqual('content');
    });

    fireEvent.click(getByTestId('confirm-variables'));

    expect(applyMacro).toHaveBeenCalled();
  });
});

it('doesnt change focus if field doesnt have value yet', async () => {
  const macro: Macro = {
    id: 'selected-macro-id',
    label: 'my macro',
    text: 'macro text {variable} {secondVariable}',
  };

  store.dispatch(createMacro(macro));
  store.dispatch(selectMacro(macro.id));

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroApply
        applyMacro={jest.fn()}
        back={jest.fn()}
        renderIntoTitle={() => <>{null}</>}
      />
    </Provider>
  );

  await act(async () => {
    fireEvent.keyDown(getByTestId('variable-input-variable'), {
      key: 'Enter',
    });

    expect(document.activeElement).toEqual(
      getByTestId('variable-input-variable')
    );
    expect(document.activeElement).not.toEqual(
      getByTestId('variable-input-secondVariable')
    );

    fireEvent.change(getByTestId('variable-input-variable'), {
      target: {
        value: 'content',
      },
    });

    await waitFor(() => {
      expect(
        (getByTestId('variable-input-variable') as HTMLInputElement).value
      ).toEqual('content');
    });

    fireEvent.keyDown(getByTestId('variable-input-variable'), {
      key: 'Enter',
    });
  });

  expect(document.activeElement).not.toEqual(
    getByTestId('variable-input-variable')
  );
  expect(document.activeElement).toEqual(
    getByTestId('variable-input-secondVariable')
  );
});
