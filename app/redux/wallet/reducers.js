import { fromJS } from 'immutable';
import {
  SET_WALLET,
  SET_IS_LOADING,
  SET_WALLET_FILENAME,
  SET_WALLET_LOCATION,
  SET_PASSWORD,
  SET_IDENTITIES,
  ADD_NEW_IDENTITY,
  UPDATE_IDENTITY,
  ADD_NEW_ACCOUNT,
  SET_SELECT_ACCOUNT,
  LOGOUT,
} from './types';

const initState = fromJS({
  identities: [],
  isLoading: false,
  walletFileName: '',
  walletLocation: '',
  selectedAccountHash: '',
  selectedParentHash: '',
  password: ''
});

export default function wallet(state = initState, action) {
  switch (action.type) {
    case SET_WALLET:
      return fromJS(action.wallet);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SET_WALLET_FILENAME:
      return state.set('walletFileName', action.walletFileName);
    case SET_WALLET_LOCATION:
      return state.set('walletLocation', action.walletLocation);
    case SET_PASSWORD:
      return state.set('password', action.password);
    case SET_IDENTITIES:
      return state.set('identities', fromJS(action.identities));
    case ADD_NEW_IDENTITY: {
      const newIdentity = fromJS(action.identity);

      return state.update('identities', identities =>
        identities.push(newIdentity)
      );
    }
    case UPDATE_IDENTITY: {
      const { publicKeyHash } = action.identity;
      const identities = state.get('identities');
      const indexFound = identities
        .findIndex((identity) => publicKeyHash === identity.get('publicKeyHash') );

      if ( indexFound > -1) {
        return state.set('identities', identities.set(indexFound, fromJS(action.identity)));
      }
      return state;
    }
    case ADD_NEW_ACCOUNT: {
      const { publicKeyHash, account } = action;
      const identities = state.get('identities');
      const indexFound = identities
        .findIndex((identity) => publicKeyHash === identity.get('publicKeyHash') );

      if ( indexFound > -1) {
        let identity = identities.get(indexFound);
        const accounts = identity.get('accounts');
        identity = identity.set('accounts', accounts.push(fromJS(account)));
        return state.set('identities', identities.set(indexFound, identity));
      }
      return state;
    }
    case SET_SELECT_ACCOUNT:
      return state
        .set('selectedAccountHash', action.selectedAccountHash)
        .set('selectedParentHash', action.selectedParentHash);
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}