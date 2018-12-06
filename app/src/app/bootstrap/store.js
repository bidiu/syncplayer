/* bootstrap Redux reducers and store */

import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from '../common/state/rootReducer';
import rootEpic from '../common/epics/rootEpic';

// for time travel debugging (with Chrome Redux extension)
// TODO might be removed when deploy to production
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

export default store;
