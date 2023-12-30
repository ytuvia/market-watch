// third-party
import { configureStore } from '@reduxjs/toolkit';
import ThreadListener from './reducers/threads/threadListener';

// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

new ThreadListener(store);

const { dispatch } = store;

export { store, dispatch };
