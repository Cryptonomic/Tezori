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
  LOGOUT,
} from './types';
import actionCreator from '../../utils/reduxHelpers';


export const setWallet = actionCreator(SET_WALLET, 'wallet');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const setWalletFileName = actionCreator( SET_WALLET_FILENAME, 'walletFileName' );
export const updateWalletLocation = actionCreator( SET_WALLET_LOCATION, 'walletLocation');
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setIdentities = actionCreator(SET_IDENTITIES, 'identities');
export const addNewIdentity = actionCreator(ADD_NEW_IDENTITY, 'identity');
export const updateIdentity = actionCreator(UPDATE_IDENTITY, 'identity');
export const addNewAccount = actionCreator(ADD_NEW_ACCOUNT, 'publicKeyHash', 'account');
export const logout = actionCreator(LOGOUT);
