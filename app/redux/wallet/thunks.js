import path from 'path';
import { flatten, pick } from 'lodash';
import { TezosWallet, TezosConseilQuery, TezosOperations } from 'conseiljs';
import { push } from 'react-router-redux';
import { addMessage } from '../../reducers/message.duck';
import { CREATE, IMPORT } from '../../constants/CreationTypes';
import { FUNDRAISER, GENERATE_MNEMONIC } from '../../constants/AddAddressTypes';
import { addMessage } from '../../reducers/message.duck';
import { displayError } from '../../utils/formValidation';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';

import {
  logout,
  setWallet,
  setIdentities,
  addNewIdentity,
  updateIdentity,
  addNewAccount
} from './actions';

const {
  unlockFundraiserIdentity,
  unlockIdentityWithMnemonic,
  createWallet,
  loadWallet,
  saveWallet
} = TezosWallet;

const {
  getAccount
} = TezosConseilQuery;

const {
  sendIdentityActivationOperation
} = TezosOperations;


import {
  findAccountIndex,
  getSyncAccount
} from '../../utils/account';
import {
  findIdentity,
  findIdentityIndex,
  createIdentity,
  getSyncIdentity
} from '../../utils/identity';

import { getSelected } from '../../utils/nodes';

export function syncAccount(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state().address.get('identities').toJS();
    const identity = findIdentity(identities, selectedParentHash);
    const foundIndex = findAccountIndex( identity, selectedAccountHash );
    const account = identity.accounts[ foundIndex ];

    if ( foundIndex > -1 ) {
      identity.accounts[ foundIndex ] = await getSyncAccount(
        identities,
        account,
        nodes,
        selectedAccountHash,
        selectedParentHash
      ).catch( e => {
        console.log('-debug: Error in: syncAccount for:' + identity.publicKeyHash);
        console.error(e);
        return account;
      });
    }

    dispatch(updateIdentity(identity));
  };
}

export function syncIdentity(publicKeyHash) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state().address.get('identities').toJS();
    const selectedAccountHash = state().address.get('selectedAccountHash');
    let identity = findIdentity(identities, publicKeyHash);

    identity = await getSyncIdentity(
      identities,
      identity,
      nodes,
      selectedAccountHash
    ).catch( e => {
      console.log('-debug: Error in: syncIdentity for:' + publicKeyHash);
      console.error(e);
      return identity;
    });

    dispatch(
      updateIdentity(identity)
    );
  };
}

export function syncWallet() {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const nodes = state().nodes.toJS();
    let identities = state().address.get('identities').toJS();
    const selectedAccountHash = state().address.get('selectedAccountHash');

    identities = await Promise.all(
      ( identities || [])
        .map(async identity => {
          const { publicKeyHash } = identity;
          return await getSyncIdentity(identities, identity, nodes, selectedAccountHash).catch( e => {
            console.log('-debug: Error in: syncIdentity for: ' + publicKeyHash);
            console.error(e);
            return identity;
          });
        })
    );
    dispatch( setIdentities( identities ) );
    dispatch(setIsLoading(false));
  }
}

// todo: 1 check why when importing new identity and going to settings then back - we are going to import identity screen again
// todo: 2 why on first login-import public has key throws an error
// todo: 3 on create account success add that account to file - incase someone closed wallet before ready was finish.
export function selectDefaultAccountOrOpenModal() {
  return async (dispatch, state) => {
    dispatch(automaticAccountRefresh());
    const isInitiated = state().address.get('isInitiated');
    if ( isInitiated ) {
      return false;
    }
    try {
      let identities = state().wallet.get('identities').toJS();
      if ( identities.length === 0 ) {
        return dispatch(openAddAddressModal());
      }
      dispatch(setIsLoading(true));
      identities = identities
        .map( identity =>
          createIdentity(identity)
        );
      dispatch( setIdentities( identities ) );

      const { publicKeyHash } = identities[0];
      dispatch(setSelectedAccount(publicKeyHash, publicKeyHash));
      dispatch(setIsInitiated(true));
    } catch( e ) {
      console.log('e', e);
    }

    await dispatch(syncWallet());
    dispatch(setIsLoading(false));
  };
}

let currentAccountRefreshInterval = null;
export function automaticAccountRefresh() {
  return (dispatch, state) => {
    const oneSecond = 1000; // milliseconds
    const oneMinute = 60 * oneSecond;
    const minutes = 1;
    const REFRESH_INTERVAL = minutes * oneMinute;

    if (currentAccountRefreshInterval) {
      clearAccountRefreshInterval();
    }

    currentAccountRefreshInterval = setInterval(() =>
        dispatch(syncWallet())
      ,
      REFRESH_INTERVAL
    );
  };
}

export function importAddress() {
  return async (dispatch, state) => {
    const {
      FUNDRAISER,
      GENERATE_MNEMONIC
    } = ADD_ADDRESS_TYPES;
    const activeTab = state().address.get('activeTab');
    const seed = state().address.get('seed');
    const pkh = state().address.get('pkh');
    const activationCode = state().address.get('activationCode');
    const username = state().address.get('username');
    const passPhrase = state().address.get('passPhrase');
    const confirmedPassPhrase = state().address.get('confirmedPassPhrase');
    const nodes = state().nodes.toJS();
    const identities = state().address.get('identities');

    // TODO: clear out message bar
    dispatch(addMessage('', true));

    if( activeTab === GENERATE_MNEMONIC ) {
      const validations = [
        { value: passPhrase, type: 'minLength8', name: 'Pass Phrase'},
        { value: [passPhrase, confirmedPassPhrase], type: 'samePassPhrase', name: 'Pass Phrases'}
      ];

      const error = displayError(validations);
      if ( error ) {
        return dispatch(addMessage(error, true));
      }
    }
    dispatch(setIsLoading(true));
    try {
      let identity = null;
      switch (activeTab) {
        case PRIVATE_KEY:
          break;
        case GENERATE_MNEMONIC:
        case SEED_PHRASE:
          identity = await unlockIdentityWithMnemonic(seed, passPhrase);
          break;
        case FUNDRAISER:
          identity = await unlockFundraiserIdentity(seed, username, passPhrase, pkh);
          const conseilNode = getSelected(nodes, CONSEIL);

          const account = await getAccount(
            conseilNode.url,
            identity.publicKeyHash,
            conseilNode.apiKey
          ).catch( () => false );

          if ( !account ) {
            const tezosNode = getSelected(nodes, TEZOS);
            const activating = await sendIdentityActivationOperation(
              tezosNode.url,
              identity,
              activationCode
            )
              .catch((err) => {
                err.name = err.message;
                throw err;
              });
            dispatch(addMessage(
              `Successfully sent activation operation ${activating.operationGroupID}.`,
              false
            ));
          }
          break;
      }

      if ( identity ) {
        const { publicKeyHash } = identity;
        if ( findIdentityIndex(identities.toJS(), publicKeyHash) === -1 ) {
          dispatch(addNewIdentity(
            createIdentity(identity)
          ));

          dispatch(saveUpdatedWallet());
          await dispatch(selectAccount(publicKeyHash, publicKeyHash));
        } else {
          dispatch(addMessage('Identity already exist', true));
        }
      }

      dispatch(clearState());
    } catch (e) {
      console.log('-debug: Error in: importAddress for:' + activeTab);
      console.error(e);
      dispatch(addMessage(e.name, true));
    }

    dispatch(setIsLoading(false));
  };
}































export function goHomeAndClearState() {
  return dispatch => {
    dispatch(logout());
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

export function login(loginType, walletLocation, walletFileName, password) {
  return async (dispatch, state) => {
    const completeWalletPath = path.join(walletLocation, walletFileName);
    dispatch(addMessage('', true));
    try {
      let wallet = {};
      if (loginType === CREATE) {
        wallet = await createWallet(completeWalletPath, password);
      } else if (loginType === IMPORT) {
        wallet = await loadWallet(completeWalletPath, password).catch((err) => {
          err.name = 'Invalid wallet/password combination.';
          throw err;
        });
      }
      
      dispatch(
        setWallet({
          identities: wallet.identities,
          walletLocation,
          walletFileName,
          password
        }, 'wallet')
      );
    } catch (e) {
      dispatch(addMessage(e.name, true));
      return false;
    }
    return true;
  };
}