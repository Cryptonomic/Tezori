// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import message from './message.duck';
import nodes from '../redux/nodes/reducers';
import wallet from '../redux/wallet/reducers';

const rootReducer = combineReducers({
  message,
  nodes,
  wallet,
  router
});

export default rootReducer;
