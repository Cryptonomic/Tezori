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
  WALLET_IS_SYNCING
} from './types';
import actionCreator from '../../utils/reduxHelpers';

export const setWallet = actionCreator(SET_WALLET, 'wallet');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const setWalletFileName = actionCreator(
  SET_WALLET_FILENAME,
  'walletFileName'
);
export const updateWalletLocation = actionCreator(
  SET_WALLET_LOCATION,
  'walletLocation'
);
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setIdentities = actionCreator(SET_IDENTITIES, 'identities');
export const setNodesStatus = actionCreator(SET_NODES_STATUS, 'nodesStatus');
export const addNewIdentity = actionCreator(ADD_NEW_IDENTITY, 'identity');
export const updateIdentity = actionCreator(UPDATE_IDENTITY, 'identity');
export const updateFetchedTime = actionCreator(UPDATE_FETCHED_TIME, 'time');
export const logout = actionCreator(LOGOUT);
export const setWalletIsSyncing = actionCreator(WALLET_IS_SYNCING, 'isWalletSyncing');
