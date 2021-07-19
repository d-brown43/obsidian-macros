import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store, { setSettingEnabled } from '../redux';
import FormatDatetimeContext from '../FormatDatetimeContext';
import MacroApplyBuiltin from './MacroApplyBuiltin';

it('applies immediately if macro is datetime', () => {
  store.dispatch(
    setSettingEnabled({
      currentTime: true,
    })
  );

  const formatDatetime = jest.fn(() => 'formatted date');
  const apply = jest.fn();
  const {} = render(
    <Provider store={store}>
      <FormatDatetimeContext.Provider
        value={{
          formatDatetime,
        }}
      >
        <MacroApplyBuiltin
          macroId={'currentTime'}
          renderIntoTitle={(el) => el}
          apply={apply}
          renderApply={() => <>{null}</>}
        />
      </FormatDatetimeContext.Provider>
    </Provider>
  );

  expect(apply).toHaveBeenLastCalledWith('formatted date');
});
