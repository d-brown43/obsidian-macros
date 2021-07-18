import { observeStore } from './observeStore';
import store, { createMacro, getMacros, selectMacro } from '../redux';

it('adds a subscription to the redux store, calling given callback when selected state has changed', () => {
  const callback = jest.fn();
  const unsubscribe = observeStore(getMacros, callback);

  expect(callback).not.toHaveBeenCalled();

  store.dispatch(
    createMacro({
      text: 'text',
      label: 'label',
    })
  );

  expect(callback).toHaveBeenCalledWith([
    expect.objectContaining({
      text: 'text',
      label: 'label',
    }),
  ]);

  store.dispatch(selectMacro('id'));

  expect(callback).toHaveBeenCalledTimes(1);

  unsubscribe();

  store.dispatch(
    createMacro({
      text: 'another macro',
      label: 'another macro',
    })
  );

  expect(callback).toHaveBeenCalledTimes(1);
});
