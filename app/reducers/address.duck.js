import { fromJS } from 'immutable';
import { flatten, pick } from 'lodash';
import { push } from 'react-router-redux';
import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';

import { saveUpdatedWallet } from '../redux/wallet/thunks';
import { LOGOUT } from '../redux/wallet/types';
import { addMessage } from './message.duck';
import { updateAddress } from '../reducers/delegate.duck';
import { displayError } from '../utils/formValidation';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';

import {
  findAccount,
  findAccountIndex,
  getSyncAccount
} from '../utils/account';
import { 
  findIdentity, 
  findIdentityIndex, 
  createIdentity,
  getSyncIdentity
} from '../utils/identity';

import { getSelectedNode } from '../utils/nodes';

const {
  getAccount,
} = TezosConseilQuery;

const {
  unlockFundraiserIdentity,
  generateMnemonic,
  unlockIdentityWithMnemonic
} = TezosWallet;
const {
  sendIdentityActivationOperation
} = TezosOperations;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const OPEN_ADD_ADDRESS_MODAL = 'OPEN_ADD_ADDRESS_MODAL';
const CLOSE_ADD_ADDRESS_MODAL = 'CLOSE_ADD_ADDRESS_MODAL';
const SET_ACTIVE_ADD_ADDRESS_TAB = 'SET_ACTIVE_ADD_ADDRESS_TAB';
const SET_IS_INITIATED = 'SET_IS_INITIATED';
const SET_IS_LOADING = 'SET_IS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';
const UPDATE_PRIVATE_KEY = 'UPDATE_PRIVATE_KEY';
const UPDATE_PUBLIC_KEY = 'UPDATE_PUBLIC_KEY';
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_PASS_PHRASE = 'UPDATE_ADDRESS_PASS_PHRASE';
const CONFIRM_PASS_PHRASE = 'CONFIRM_ADDRESS_PASS_PHRASE';
const UPDATE_SEED = 'UPDATE_SEED';
const UPDATE_PKH = 'UPDATE_PKH';
const UPDATE_ACTIVATION_CODE = 'UPDATE_ACTIVATION_CODE';
const SET_IDENTITIES = 'SET_IDENTITIES';
const SELECT_ACCOUNT = 'SELECT_ACCOUNT';


/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */

export const openAddAddressModal = actionCreator(OPEN_ADD_ADDRESS_MODAL);
export const closeAddAddressModal = actionCreator(CLOSE_ADD_ADDRESS_MODAL);
const updateActiveTab = actionCreator(SET_ACTIVE_ADD_ADDRESS_TAB, 'activeTab');
export const setIsInitiated = actionCreator(SET_IS_INITIATED, 'isInitiated');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const clearState = actionCreator(CLEAR_STATE);
export const updatePrivateKey = actionCreator(UPDATE_PRIVATE_KEY, 'privateKey');
export const updatePublicKey = actionCreator(UPDATE_PUBLIC_KEY, 'publicKey');
export const updateUsername = actionCreator(UPDATE_USERNAME, 'username');
export const updatePassPhrase = actionCreator(UPDATE_PASS_PHRASE, 'passPhrase');
export const confirmPassPhrase = actionCreator(
  CONFIRM_PASS_PHRASE,
  'passPhrase'
);
export const updateSeed = actionCreator(UPDATE_SEED, 'seed');
export const updatePkh = actionCreator(UPDATE_PKH, 'pkh');
export const updateActivationCode = actionCreator(UPDATE_ACTIVATION_CODE, 'activationCode');

export const setIdentities = actionCreator(SET_IDENTITIES, 'identities');

const setSelectedAccount = actionCreator(
  SELECT_ACCOUNT,
  'selectedAccountHash',
  'selectedParentHash'
);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */

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

export function setAccountDelegateAddress(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {
    if ( selectedAccountHash !== selectedParentHash ) {
      const identities = state().address.get('identities').toJS();
      const identity = findIdentity(identities, selectedParentHash);
      const account = findAccount(identity, selectedAccountHash);
      dispatch(updateAddress(account.delegateValue));
    }
  };
}

export function selectAccount(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {

    try{
      dispatch(setIsLoading(true));
      dispatch(setSelectedAccount(
        selectedAccountHash,
        selectedParentHash
      ));
      dispatch(setAccountDelegateAddress(selectedAccountHash, selectedParentHash));
      if (selectedAccountHash === selectedParentHash ) {
        await dispatch(syncIdentity(selectedAccountHash));
      } else {
        await dispatch(syncAccount(selectedAccountHash, selectedParentHash));
      }
    } catch (e) {
      console.log('-debug: Error in: selectAccount for:' + selectedAccountHash, selectedParentHash);
      console.error(e);
      dispatch(addMessage(e.name, true));
      dispatch(setIsLoading(false));
    }
    dispatch(setIsLoading(false));
  };
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

export function setActiveTab(activeTab) {
  return async dispatch => {
    const { GENERATE_MNEMONIC } = ADD_ADDRESS_TYPES;

    dispatch(updateActiveTab(activeTab));

    // TODO: clear out message bar if there are errors from other tabs
    dispatch(addMessage('', true));

    if (activeTab === GENERATE_MNEMONIC) {
      try {
        dispatch(setIsLoading(true));
        const seed = await generateMnemonic();

        dispatch(setIsLoading(false));
        dispatch(updateSeed(seed));
      } catch (e) {
        console.log('-debug: Error in: setActiveTab for:' + activeTab);
        console.error(e);
        dispatch(addMessage(e.name, true));
        dispatch(setIsLoading(false));
      }
    }
  };
}

function setImportDuplicationError(dispatch) {
  dispatch(addMessage('Identity already exist', true));
}

export function importAddress() {
  return async (dispatch, state) => {
    const {
      FUNDRAISER,
      SEED_PHRASE,
      PRIVATE_KEY,
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
          const conseilNode = getSelectedNode(nodes, CONSEIL);

          const account = await getAccount(
            conseilNode.url,
            identity.publicKeyHash,
            conseilNode.apiKey
          ).catch( () => false );

          if ( !account ) {
            const tezosNode = getSelectedNode(nodes, TEZOS);
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
          setImportDuplicationError(dispatch);
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

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
  open: false,
  seed: '',
  pkh: '',
  activationCode: '',
  username: '',
  passPhrase: '',
  privateKey: '',
  publicKey: '',
  isInitiated: false,
  isLoading: false,
  identities: [],
  selectedAccountHash: '',
  selectedParentHash: ''
});

export default function address(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE: {
      const identities = state.get('identities');
      const selectedAccountHash = state.get('selectedAccountHash');
      const selectedParentHash = state.get('selectedParentHash');

      return initState
        .set('identities', identities)
        .set('selectedAccountHash', selectedAccountHash)
        .set('selectedParentHash', selectedParentHash);
    }
    case SET_IDENTITIES: {
      return state.set('identities', fromJS(action.identities));
    }
    case CLOSE_ADD_ADDRESS_MODAL:
      return state.set('open', false);
    case OPEN_ADD_ADDRESS_MODAL:
      return state.set('open', true);
    case SET_ACTIVE_ADD_ADDRESS_TAB:
      return state.set('activeTab', action.activeTab).set('seed', '');
    case UPDATE_PRIVATE_KEY:
      return state.set('privateKey', action.privateKey);
    case UPDATE_PUBLIC_KEY:
      return state.set('publicKey', action.publicKey);
    case UPDATE_SEED:
      return state.set('seed', action.seed);
    case UPDATE_PKH:
      return state.set('pkh', action.pkh);
    case UPDATE_ACTIVATION_CODE:
      return state.set('activationCode', action.activationCode);
    case UPDATE_USERNAME:
      return state.set('username', action.username);
    case UPDATE_PASS_PHRASE:
      return state.set('passPhrase', action.passPhrase);
    case CONFIRM_PASS_PHRASE:
      return state.set('confirmedPassPhrase', action.passPhrase);
    case SET_IS_INITIATED:
      return state.set('isInitiated', action.isInitiated);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SELECT_ACCOUNT:
      return state
        .set('selectedAccountHash', action.selectedAccountHash)
        .set('selectedParentHash', action.selectedParentHash);
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function addNewAccountToIdentity(publicKeyHash, account, identities) {
  return identities.map(identity => {
    if (identity.get('publicKeyHash') === publicKeyHash) {
      const accounts = identity.get('accounts').toJS();
      accounts.push(account);
      return identity.set('accounts', fromJS(accounts));
    }
    return identity;
  });
}

export function clearAccountRefreshInterval() {
  clearInterval(currentAccountRefreshInterval);
}

export const getTotalBalance = state => {
  const { address = {} } = state;
  const identities = address.get('identities');

  const balances = identities.toJS().map(identity => identity.balance);
  return balances.reduce((acc, curr) => acc + curr, 0);
};