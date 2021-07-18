import store, { rehydrate } from '../redux';
import { resetUi } from '../redux';

export const resetStoreState = () => {
  store.dispatch(rehydrate([]));
  store.dispatch(resetUi());
};
