import store, { RootState } from '../redux';

export const observeStore = <R>(
  selector: (state: RootState) => R,
  callback: (value: R) => void,
) => {
  let previousValue = selector(store.getState());
  let isHandling = false;

  return store.subscribe(() => {
    const state = selector(store.getState());
    if (state !== previousValue && !isHandling) {
      isHandling = true;
      previousValue = state;
      callback(state);
      isHandling = false;
    }
  });
};
