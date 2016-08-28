import createReducer from '../../app/reducers.js';
import configureStore from '../../app/store.js';
import reducers from './reducers';
import sagas from './sagas.js';

export default (history) => {
	const initialState = {};
	const store = configureStore(initialState, history);
	store.asyncReducers = reducers;
	store.replaceReducer(createReducer(store.asyncReducers));
	sagas.map(store.runSaga);
	return store;
};
