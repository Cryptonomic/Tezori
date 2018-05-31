// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import walletInitialization from './walletInitialization';

const rootReducer = combineReducers({
  counter,
  walletInitialization,
  router,
});

export default rootReducer;
