import path from 'path';
import { TezosWallet } from 'conseiljs';
import { push } from 'react-router-redux';
import { clearEntireAddressState } from '../../reducers/address.duck';
import { addMessage } from '../../reducers/message.duck';
import { displayError } from '../../utils/formValidation';
import { CREATE, IMPORT } from '../../constants/CreationTypes';

import {
  clearWalletState,
  setWallet
} from './actions';

const { createWallet, loadWallet, saveWallet } = TezosWallet;

export function goHomeAndClearState() {
  return dispatch => {
    dispatch(clearWalletState());
    dispatch(clearEntireAddressState());
    dispatch(push('/'));
  };
}

export function saveUpdatedWallet(identities) {
  return async (dispatch, state) => {
    try {
      const identities = state().address.get('identities').toJS();
      const walletLocation = state().wallet.get('walletLocation');
      const walletFileName = state().wallet.get('walletFileName');
      const walletIdentities = state().wallet.get('identities').toJS();

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
    } catch (e) {
      dispatch(addMessage(e.name, true));
      throw e;
    }
  };
}

export function login(loginType, walletLocation, walletFileName, password, confirmedPassword) {
  return async (dispatch, state) => {
    const completeWalletPath = path.join(walletLocation, walletFileName);

    // TODO: clear out message bar
    dispatch(addMessage('', true));

    let validations = [
      { value: walletLocation, type: 'locationFilled'},
      { value: `${walletLocation}/${walletFileName}`, type: 'validJS'},
      { value: password, type: 'notEmpty', name: 'Password' },
      { value: password, type: 'minLength8', name: 'Password' }
    ];

    if (loginType === CREATE ) {
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
      let identities = [];
      if (loginType === CREATE) {
        identities = await createWallet(completeWalletPath, password);
      } else if (loginType === IMPORT) {
        identities = await loadWallet(completeWalletPath, password).catch((err) => {
          err.name = 'Invalid wallet/password combination.';
          throw err;
        });
      }

      throw new Error('whaaaaatt');
      
      dispatch(
        setWallet({
          identities,
          walletLocation,
          walletFileName,
          password
        }, 'wallet')
      );
    } catch (e) {
      dispatch(addMessage(e.name, true));
      return false;
    }
  };
}