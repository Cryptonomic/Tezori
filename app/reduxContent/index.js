// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import message from './message/reducers';
import settings from './settings/reducers';
import wallet from './wallet/reducers';

const rootReducer = combineReducers({
  message,
  settings,
  wallet,
  router
});

export default rootReducer;
