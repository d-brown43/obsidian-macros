import { render } from '@testing-library/react';
import { resetStoreState } from '../testUtils';
import store, { createMacro } from '../redux';
import { Provider } from 'react-redux';
import MacroItem from './MacroItem';

beforeEach(resetStoreState);

it('renders', () => {
  store.dispatch(
    createMacro({
      id: 'macro-1',
      text: 'text',
      label: 'label',
    })
  );

  const { queryByTestId } = render(
    <Provider store={store}>
      <MacroItem macroId="macro-1" doFocus={false} />
    </Provider>
  );

  expect(queryByTestId('macro-item-macro-1')).not.toBeNull();
});

it('renders nothing if macro id does not exist', () => {
  const { queryByTestId } = render(
    <Provider store={store}>
      <MacroItem macroId="macro-1" doFocus={false} />
    </Provider>
  );

  expect(queryByTestId('macro-item-macro-1')).toBeNull();
});
