import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_WALLET,
  SET_IS_LOADING,
  SET_WALLET_FILENAME,
  SET_WALLET_LOCATION,
  SET_PASSWORD,
  SET_IDENTITIES,
  SET_NODES_STATUS,
  ADD_NEW_IDENTITY,
  UPDATE_IDENTITY,
  UPDATE_FETCHED_TIME,
  LOGOUT,
  SET_LEDGER,
  SET_IS_LEDGER_CONNECTIONG
} from './types';

export const initialState = {
  identities: [],
  isLoading: false,
  walletFileName: '',
  walletLocation: '',
  password: '',
  nodesStatus: {
    tezos: {
      responsive: true,
      level: 0
    },
    conseil: {
      responsive: true,
      level: 0
    }
  },
  time: new Date(),
  isLedger: false,
  isLedgerConnecting: false
};

export default handleActions(
  {
    [SET_WALLET]: (state, action) => {
      return fromJS({ ...state.toJS(), ...action.wallet });
    },
    [SET_IS_LOADING]: (state, action) => {
      return state.set('isLoading', action.isLoading);
    },
    [SET_WALLET_FILENAME]: (state, action) => {
      return state.set('walletFileName', action.walletFileName);
    },
    [SET_WALLET_LOCATION]: (state, action) => {
      return state.set('walletLocation', action.walletLocation);
    },
    [SET_PASSWORD]: (state, action) => {
      return state.set('password', action.password);
    },
    [SET_IDENTITIES]: (state, action) => {
      return state.set('identities', fromJS(action.identities));
    },
    [SET_NODES_STATUS]: (state, action) => {
      return state.set('nodesStatus', fromJS(action.nodesStatus));
    },
    [ADD_NEW_IDENTITY]: (state, action) => {
      const newIdentity = fromJS(action.identity);

      return state.update('identities', identities =>
        identities.push(newIdentity)
      );
    },
    [UPDATE_IDENTITY]: (state, action) => {
      const { publicKeyHash } = action.identity;
      const identities = state.get('identities');
      const indexFound = identities.findIndex(
        identity => publicKeyHash === identity.get('publicKeyHash')
      );

      if (indexFound > -1) {
        return state.set(
          'identities',
          identities.set(indexFound, fromJS(action.identity))
        );
      }
      return state;
    },
    [UPDATE_FETCHED_TIME]: (state, action) => {
      return state.set('time', action.time);
    },
    [LOGOUT]: () => {
      return fromJS(initialState);
    },
    [SET_LEDGER]: (state, action) => {
      return state.set('isLedger', action.isLedger);
    },
    [SET_IS_LEDGER_CONNECTIONG]: (state, action) => {
      return state.set('isLedgerConnecting', action.isLedgerConnecting);
    }
  },
  fromJS(initialState)
);
