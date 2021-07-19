import store, { rehydrate } from '../redux';
import { resetUi } from '../redux';

export const resetStoreState = () => {
  store.dispatch(
    rehydrate({
      macros: [],
      builtins: {
        currentTime: {
          isEnabled: false,
          label: 'Current Time',
          type: 'currentTime',
        },
      },
    })
  );
  store.dispatch(resetUi());
};
