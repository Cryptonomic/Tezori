// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import addAddress from './addAddress.duck';
import sendTezos from './sendTezos.duck';
import walletInitialization from './walletInitialization.duck';

const rootReducer = combineReducers({
  addAddress,
  sendTezos,
  walletInitialization,
  router,
});

export default rootReducer;
