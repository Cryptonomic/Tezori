import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import path from 'path';
import { tezosWallet } from '../conseil';

import actionCreator from '../utils/reduxHelpers';
import CREATION_CONSTANTS from '../constants/CreationTypes';

const { createWallet, loadWallet, saveWallet } = tezosWallet;

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const SET_PASSWORD = 'SET_PASSWORD';
const SET_DISPLAY = 'SET_DISPLAY';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_WALLET_FILENAME = 'SET_WALLET_FILENAME';
const SET_WALLET_LOCATION = 'SET_WALLET_LOCATION';
const SET_CURRENT_WALLET = 'SET_CURRENT_WALLET';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setDisplay = actionCreator(SET_DISPLAY, 'currentDisplay');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const setWalletFileName = actionCreator(SET_WALLET_FILENAME, 'walletFileName');
const updateWalletLocation = actionCreator(SET_WALLET_LOCATION, 'walletLocation');
const setCurrentWallet = actionCreator(SET_CURRENT_WALLET, 'wallet');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function saveUpdatedWallet(identities) {
  return async (dispatch, state) => {
    const newIdentities = identities.toJS();

    try {
      dispatch(setIsLoading(true));
      const walletLocation = state().walletInitialization.get('walletLocation');
      const walletIdentities = state().walletInitialization.getIn(['wallet', 'identities']);

      await saveWallet(walletLocation, {
        identities: walletIdentities.concat(newIdentities)
      }, 'password');

      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  }
}

export function submitAddress(submissionType: 'create' | 'import' ) {
  return async (dispatch, state) => {
    const walletLocation = state().walletInitialization.get('walletLocation');
    const walletFileName = state().walletInitialization.get('walletFileName');
    const password = state().walletInitialization.get('password');
    let wallet = [];

    try {
      dispatch(setIsLoading(true));
      if (submissionType === CREATE) {
        wallet = await createWallet(`/tmp/${walletFileName}.json`, password);
        dispatch(updateWalletLocation(`/tmp/${walletFileName}.json`));
      } else if (submissionType === IMPORT) {
        wallet = await loadWallet(walletLocation, password);
      }

      dispatch(setCurrentWallet(fromJS(wallet)));
      dispatch(setDisplay(DEFAULT));
      dispatch(setIsLoading(false));
      dispatch(push('/addresses'));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  };
}

export function setWalletLocation(walletLocation) {
  return async (dispatch) => {
    dispatch(updateWalletLocation(walletLocation));
    dispatch(setWalletFileName(path.basename(walletLocation)));
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  currentDisplay: DEFAULT,
  isLoading: false,
  password: '',
  walletFileName: '',
  walletLocation: '',
  network: 'zeronet',
  wallet: {},
});

export default function walletInitialization(state = initState, action) {
  switch (action.type) {
    case SET_CURRENT_WALLET:
      return state.set('wallet', action.wallet);
    case SET_DISPLAY:
      return state.set('currentDisplay', action.currentDisplay);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SET_WALLET_FILENAME:
      return state.set('walletFileName', action.walletFileName);
    case SET_WALLET_LOCATION:
      return state.set('walletLocation', action.walletLocation);
    case SET_PASSWORD:
      return state.set('password', action.password);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
