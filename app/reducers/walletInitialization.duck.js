import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import { get } from 'lodash';

import path from 'path';
import { TezosWallet } from 'conseiljs';

import { logout } from './address.duck';
import { addMessage } from './message.duck';
import actionCreator from '../utils/reduxHelpers';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import { displayError } from '../utils/formValidation';

const { createWallet, loadWallet, saveWallet } = TezosWallet;

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const CLEAR_WALLET_STATE = 'CLEAR_WALLET_STATE';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_CONFIRMED_PASSWORD = 'SET_CONFIRMED_PASSWORD';
const SET_DISPLAY = 'SET_DISPLAY';
const SET_IS_LOADING = 'SET_IS_LOADING';
const SET_WALLET_FILENAME = 'SET_WALLET_FILENAME';
const SET_WALLET_LOCATION = 'SET_WALLET_LOCATION';
const SET_CURRENT_WALLET = 'SET_CURRENT_WALLET';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function goHomeAndClearState() {
  return dispatch => {
    dispatch(logout());
    dispatch(push('/'));
  };
}

export function saveUpdatedWallet(identities) {
  return async (dispatch, state) => {
    try {
      dispatch(setIsLoading(true));
      const identities = state().address.get('identities').toJS();
      const walletLocation = state().wallet.get('walletLocation');
      const walletFileName = state().wallet.get('walletFileName');
      const walletIdentities = state().wallet.getIn([
        'wallet',
        'identities'
      ]).toJS();

      const indices = walletIdentities.map( identity => identity.publicKeyHash );
      const password = state().wallet.get('password');
      const completeWalletPath = path.join(walletLocation, walletFileName);


      /* making sure only unique identities are added */
      const newIdentities = identities
        .filter(({ publicKeyHash }) =>
          indices.indexOf(publicKeyHash) === -1
        )
        .map(({ publicKey, privateKey, publicKeyHash }) => {
          return { publicKey, privateKey, publicKeyHash };
        });

      
      await saveWallet(
        completeWalletPath,
        {
          identities: walletIdentities.concat(newIdentities)
        },
        password
      );

      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
      dispatch(setIsLoading(false));
    }
  };
}

export function submitAddress(submissionType: 'create' | 'import') {
  return async (dispatch, state) => {
    const walletLocation = state().wallet.get('walletLocation');
    const walletFileName = state().wallet.get('walletFileName');
    const password = state().wallet.get('password');
    const confirmedPassword = state().wallet.get(
      'confirmedPassword'
    );
    const completeWalletPath = path.join(walletLocation, walletFileName);
    let wallet = [];

    // TODO: clear out message bar
    dispatch(addMessage('', true));

    let validations = [
      { value: walletLocation, type: 'locationFilled'},
      { value: `${walletLocation}/${walletFileName}`, type: 'validJS'},
      { value: password, type: 'notEmpty', name: 'Password' },
      { value: password, type: 'minLength8', name: 'Password' }
    ];

    if (submissionType == 'create') {
      validations.push({
        value: [password, confirmedPassword],
        type: 'samePassPhrase',
        name: 'Passwords'
      })
    }

    const error = displayError(validations);
    if (error) {
      return dispatch(addMessage(error, true));
    }

    try {
      dispatch(setIsLoading(true));
      if (submissionType === CREATE) {
        wallet = await createWallet(completeWalletPath, password);
      } else if (submissionType === IMPORT) {
        wallet = await loadWallet(completeWalletPath, password).catch((err) => {
          err.name = 'Invalid wallet/password combination.';
          throw err;
        });
      }

      dispatch(setCurrentWallet(fromJS(wallet)));
      dispatch(setDisplay(DEFAULT));
      dispatch(push('/addresses'));
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
      dispatch(setIsLoading(false));
    }
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  password: '',
  walletFileName: '',
  walletLocation: ''
});

export default function wallet(state = initState, action) {
  switch (action.type) {
    case CLEAR_WALLET_STATE:
      return initState;
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
export const getWalletName = state => {
  const fileName = state.wallet.get('walletFileName');
  const walletName = fileName.split('.');
  return walletName[0];
}