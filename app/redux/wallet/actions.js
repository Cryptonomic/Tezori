import {
  SET_WALLET,
  SET_WALLET_FILENAME,
  SET_WALLET_LOCATION,
  SET_PASSWORD,
  SET_IDENTITIES,
  LOGOUT,
} from './types';
import actionCreator from '../../utils/reduxHelpers';


export const setWallet = actionCreator(SET_WALLET, 'wallet');
export const setWalletFileName = actionCreator( SET_WALLET_FILENAME, 'walletFileName' );
export const updateWalletLocation = actionCreator( SET_WALLET_LOCATION, 'walletLocation' );
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setIdentities = actionCreator(SET_IDENTITIES, 'identities');
export const logout = actionCreator(LOGOUT);



