import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store, { createMacro } from '../redux';
import MacroApplyPopover from './MacroApplyPopover';
import { resetStoreState } from '../testUtils';

beforeEach(resetStoreState);

it('renders macro list if nothing selected, macro apply if macro is selected', () => {
  store.dispatch(
    createMacro({
      id: 'test-macro',
      text: 'test macro',
      label: 'test macro',
    })
  );

  const { queryByTestId, getByTestId } = render(
    <Provider store={store}>
      <MacroApplyPopover
        close={jest.fn()}
        applyMacro={jest.fn()}
        getCursorPosition={() => ({ left: 0, top: 0 })}
      />
    </Provider>
  );

  expect(queryByTestId('macro-item-test-macro')).not.toBeNull();

  act(() => {
    fireEvent.click(getByTestId('macro-item-test-macro'));
  });

  expect(queryByTestId('confirm-variables')).not.toBeNull();
  expect(queryByTestId('macro-item-test-macro')).toBeNull();
});

it('closes the popover when escape is pressed', async () => {
  const close = jest.fn();

  const { getByTestId } = render(
    <Provider store={store}>
      <MacroApplyPopover
        close={close}
        applyMacro={jest.fn()}
        getCursorPosition={() => ({ left: 0, top: 0 })}
      />
    </Provider>
  );

  act(() => {
    fireEvent.keyDown(getByTestId('macro-apply-popover'), {
      key: 'E',
    });
  });

  expect(close).not.toHaveBeenCalled();

  act(() => {
    fireEvent.keyDown(getByTestId('macro-apply-popover'), {
      key: 'Escape',
    });
  });

  await waitFor(() => {
    expect(close).toHaveBeenCalled();
  });
});
