// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import message from './message/reducers';
import nodes from './nodes/reducers';
import wallet from './wallet/reducers';

const rootReducer = combineReducers({
  message,
  nodes,
  wallet,
  router
});

export default rootReducer;
