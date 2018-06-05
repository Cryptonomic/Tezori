// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import address from './address.duck';
import sendTezos from './sendTezos.duck';
import delegate from './delegate.duck';
import walletInitialization from './walletInitialization.duck';

const rootReducer = combineReducers({
  address,
  sendTezos,
  delegate,
  walletInitialization,
  router,
});

export default rootReducer;
