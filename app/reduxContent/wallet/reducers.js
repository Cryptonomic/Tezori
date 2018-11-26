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
  SET_IS_LEDGER_CONNECTIONG,
  WALLET_IS_SYNCING,
  SET_IS_HOME
} from './types';

export const initialState = {
  identities: [],
  isLoading: false,
  isWalletSyncing: false,
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
  isLedgerConnecting: false,
  isHome: false
};

const logOutState = {
  identities: [],
  isLoading: false,
  isWalletSyncing: false,
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
  isHome: false
};

export default handleActions(
  {
    [SET_WALLET]: (state, action) => {
      return fromJS({ ...state.toJS(), ...action.wallet });
    },
    [SET_IS_LOADING]: (state, action) => {
      return state.set('isLoading', action.isLoading);
    },
    [WALLET_IS_SYNCING]: (state, action) => {
      return state.set('isWalletSyncing', action.isWalletSyncing);
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
    [LOGOUT]: state => {
      return fromJS({ ...state.toJS(), ...logOutState });
    },
    [SET_LEDGER]: (state, action) => {
      return state.set('isLedger', action.isLedger);
    },
    [SET_IS_LEDGER_CONNECTIONG]: (state, action) => {
      return state.set('isLedgerConnecting', action.isLedgerConnecting);
    },
    [SET_IS_HOME]: (state, action) => {
      return state.set('isHome', action.isHome);
    }
  },
  fromJS(initialState)
);
