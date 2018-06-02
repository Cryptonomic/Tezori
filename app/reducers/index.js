// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import addAddress from './addAddress.duck';
import walletInitialization from './walletInitialization.duck';

const rootReducer = combineReducers({
  addAddress,
  walletInitialization,
  router,
});

export default rootReducer;
