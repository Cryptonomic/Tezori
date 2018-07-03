import { fromJS } from 'immutable';
import {
  SET_WALLET,
  SET_WALLET_FILENAME,
  SET_WALLET_LOCATION,
  SET_PASSWORD,
  SET_IDENTITIES,
  LOGOUT,
} from './types';

const initState = fromJS({
  identities: [],
  walletFileName: '',
  walletLocation: '',
  password: ''
});

export default function wallet(state = initState, action) {
  switch (action.type) {
    case SET_WALLET:
      return fromJS(action.wallet);
    case SET_WALLET_FILENAME:
      return state.set('walletFileName', action.walletFileName);
    case SET_WALLET_LOCATION:
      return state.set('walletLocation', action.walletLocation);
    case SET_PASSWORD:
      return state.set('password', action.password);
    case SET_IDENTITIES:
      return state.set('identities', fromJS(action.identities));
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}