import { fromJS } from 'immutable';
import { flatten, find, pick } from 'lodash';
import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';

import { saveUpdatedWallet } from './walletInitialization.duck';
import { addMessage } from './message.duck';
import { changeDelegate } from './createAccount.duck';
import { displayError } from '../utils/formValidation';
import { getTransactions } from '../utils/general';
import { findAccount, createAccount, getAccountsForIdentity } from '../utils/account';
import { findIdentity, createIdentity } from '../utils/identity';

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
const CLEAR_ENTIRE_ADDRESS_STATE = 'CLEAR_ENTIRE_ADDRESS_STATE';
const OPEN_ADD_ADDRESS_MODAL = 'OPEN_ADD_ADDRESS_MODAL';
const CLOSE_ADD_ADDRESS_MODAL = 'CLOSE_ADD_ADDRESS_MODAL';
const SET_ACTIVE_ADD_ADDRESS_TAB = 'SET_ACTIVE_ADD_ADDRESS_TAB';
const SET_IS_LOADING = 'SET_IS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';
const UPDATE_PRIVATE_KEY = 'UPDATE_PRIVATE_KEY';
const UPDATE_PUBLIC_KEY = 'UPDATE_PUBLIC_KEY';
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_PASS_PHRASE = 'UPDATE_ADDRESS_PASS_PHRASE';
const CONFIRM_PASS_PHRASE = 'CONFIRM_ADDRESS_PASS_PHRASE';
const UPDATE_SEED = 'UPDATE_SEED';
const UPDATE_ACTIVATION_CODE = 'UPDATE_ACTIVATION_CODE';
const ADD_NEW_IDENTITY = 'ADD_NEW_IDENTITY';
const UPDATE_IDENTITY = 'UPDATE_IDENTITY';
const SET_IDENTITIES = 'SET_IDENTITIES';
const ADD_NEW_ACCOUNT = 'ADD_NEW_ACCOUNT';
const SELECT_ACCOUNT = 'SELECT_ACCOUNT';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const clearEntireAddressState = actionCreator(
  CLEAR_ENTIRE_ADDRESS_STATE
);
export const openAddAddressModal = actionCreator(OPEN_ADD_ADDRESS_MODAL);
export const closeAddAddressModal = actionCreator(CLOSE_ADD_ADDRESS_MODAL);
const updateActiveTab = actionCreator(SET_ACTIVE_ADD_ADDRESS_TAB, 'activeTab');
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
export const updateActivationCode = actionCreator(UPDATE_ACTIVATION_CODE, 'activationCode');
export const addNewIdentity = actionCreator(ADD_NEW_IDENTITY, 'identity');
export const updateIdentity = actionCreator(UPDATE_IDENTITY, 'identity');
export const setIdentities = actionCreator(SET_IDENTITIES, 'identities');


export const addNewAccount = actionCreator(
  ADD_NEW_ACCOUNT,
  'publicKeyHash',
  'account'
);
const setSelectedAccount = actionCreator(
  SELECT_ACCOUNT,
  'selectedAccountHash',
  'selectedParentHash'
);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */

export function syncAccountTransactions(accountHash, parentHash) {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const network = state().walletInitialization.get('network');
    const identities = state().address.get('identities').toJS();
    const identity = findIdentity(identities, parentHash);
    const account = findAccount( identity, accountHash );
    const transactions = await getTransactions(accountHash, network);

    const foundIndex = identity && ( identity.accounts || [] )
        .findIndex( account => account.accountId === accountHash );

    if ( foundIndex > -1 ) {
      identity.accounts[foundIndex] = {
        ...account,
        transactions
      };
    }

    dispatch(updateIdentity(identity));
    dispatch(setIsLoading(true));
  };
}

export function syncIdentityTransactions(accountHash) {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const network = state().walletInitialization.get('network');
    const identities = state().address.get('identities').toJS();
    const identity = findIdentity(identities, accountHash);
    const transactions = await getTransactions(accountHash, network);
    dispatch(
      updateIdentity({
        ...identity,
        transactions
      })
    );

    dispatch(setIsLoading(true));
  };
}

export function syncAccount(accountHash, parentHash) {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const network = state().walletInitialization.get('network');
    const identities = state().address.get('identities').toJS();
    const identity = findIdentity(identities, parentHash);
    const account = findAccount( identity, accountHash );
    const updatedAccount = await getAccount(network, accountHash);
    const transactions = await getTransactions(accountHash, network);

    const foundIndex = identity && ( identity.accounts || [] )
        .findIndex( account => account.accountId === accountHash );

    if ( foundIndex > -1 ) {
      identity.accounts[foundIndex] = {
        ...account,
        balance: updatedAccount.account.balance,
        transactions
      };
    }

    dispatch(updateIdentity(identity));
    dispatch(setIsLoading(true));
  };
}

export function selectAccount(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {
    const network = state().walletInitialization.get('network');
    dispatch(setIsLoading(true));
    dispatch(setSelectedAccount(
      selectedAccountHash,
      selectedParentHash
    ));
    dispatch(changeDelegate(selectedAccountHash));

    await dispatch(syncAccount(selectedAccountHash, selectedParentHash)).catch( e => {
      dispatch(addMessage(e.name, true));
    });
    dispatch(setIsLoading(false));
  };
}

export function syncWallet() {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const identities = state().address.get('identities').toJS();
    const network = state().walletInitialization.get('network');
    const selectedAccountHash = state().address.get('selectedAccountHash');
    const selectedParentHash = state().address.get('selectedParentHash');

    await Promise.all(
      ( identities || [])
        .map(async identity => {
          try {
            const { publicKeyHash } = identity;
            const account = await getAccount(network, publicKeyHash);
            const accounts =  await getAccountsForIdentity( network, publicKeyHash )
              .catch( () => []);

            dispatch(
              updateIdentity({
                ...identity,
                balance: account.account.balance,
                accounts: accounts.map(account => {
                  return createAccount( account, identity );
                })
              })
            );
          } catch(e) {
            console.error(e);
            dispatch(addMessage(e.name, true));
          }
        })
    );

    try {
      if ( selectedAccountHash === selectedParentHash ) {
        await dispatch(syncIdentityTransactions(selectedAccountHash, selectedParentHash));
      } else {
        await dispatch(syncAccountTransactions(selectedAccountHash, selectedParentHash));
      }
    } catch(e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
    }

    dispatch(setIsLoading(false));
  }
}

export function selectDefaultAccountOrOpenModal() {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const initWalletState = state().walletInitialization;
    let identities = initWalletState.getIn(['wallet', 'identities']);
    identities = identities.toJS();
    const network = initWalletState.get('network');

    if ( identities.length === 0 ) {
      return dispatch(openAddAddressModal());
    }

    identities = identities
      .filter(identity =>
        identity.publicKey && identity.privateKey && identity.publicKeyHash
      )
      .map( identity =>
        createIdentity(identity)
      );
    dispatch( setIdentities( identities ) );

    const { publicKeyHash } = identities[0];
    dispatch(setSelectedAccount(publicKeyHash, publicKeyHash));
    dispatch(changeDelegate(publicKeyHash));

    await dispatch(syncWallet());
    dispatch(setIsLoading(false));
  };
}

let currentAccountRefreshInterval = null;

export function automaticAccountRefresh() {
  return (dispatch, state) => {
    const REFRESH_INTERVAL = 5 * 60 * 1000;

    if (currentAccountRefreshInterval) {
      clearAccountRefreshInterval();
    }

    currentAccountRefreshInterval = setInterval(() => {
      const selectedAccountHash = state().address.get('selectedAccountHash');
      const selectedParentHash = state().address.get('selectedParentHash');

      dispatch(selectAccount(selectedAccountHash, selectedParentHash));
    }, REFRESH_INTERVAL);
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
    const activationCode = state().address.get('activationCode');
    const username = state().address.get('username');
    const passPhrase = state().address.get('passPhrase');
    const confirmedPassPhrase = state().address.get('confirmedPassPhrase');

    const network = state().walletInitialization.get('network');
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
    try {
      let identity = null;
      dispatch(setIsLoading(true));
      switch (activeTab) {
        case PRIVATE_KEY:
          break;
        case GENERATE_MNEMONIC:
        case SEED_PHRASE:
          identity = await unlockIdentityWithMnemonic(seed, passPhrase);
          break;
        case FUNDRAISER:
          identity = await unlockFundraiserIdentity(seed, username, passPhrase);
          const activating = await sendIdentityActivationOperation(network, identity, activationCode);
          dispatch(addMessage(
            `Successfully sent activation operation ${activating.operationGroupID}.`,
            false
          ));
          break;
      }

      if ( identity ) {
        const { publicKeyHash, publicKey, privateKey } = identity;
        if ( !find(identities.toJS(), identity) ) {
          dispatch(addNewIdentity(
            createIdentity(identity)
          ));

          const updatedIdentities = state()
            .address.get('identities')
            .map(identity => {
              return {
                publicKey: identity.get('publicKey'),
                privateKey: identity.get('privateKey'),
                publicKeyHash: identity.get('publicKeyHash')
              }
            });
          dispatch(saveUpdatedWallet(updatedIdentities));
          dispatch(selectAccount(publicKeyHash, publicKeyHash));
        } else {
          setImportDuplicationError(dispatch);
        }
      }

      dispatch(clearState());
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.message, true));
      dispatch(setIsLoading(false));
    }
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
  open: false,
  seed: '',
  activationCode: '',
  username: '',
  passPhrase: '',
  privateKey: '',
  publicKey: '',
  isLoading: false,
  identities: [],
  selectedAccountHash: '',
  selectedParentHash: ''
});

export default function address(state = initState, action) {
  switch (action.type) {
    case CLEAR_ENTIRE_ADDRESS_STATE:
      return initState;
    case CLEAR_STATE: {
      const identities = state.get('identities');
      const selectedAccountHash = state.get('selectedAccountHash');

      return initState
        .set('identities', identities)
        .set('selectedAccountHash', selectedAccountHash);
    }
    case ADD_NEW_ACCOUNT:
      return state.set(
        'identities',
        addNewAccountToIdentity(
          action.publicKeyHash,
          action.account,
          state.get('identities')
        )
      );
    case SET_IDENTITIES: {
      return state.set('identities', fromJS(action.identities));
    }
    case ADD_NEW_IDENTITY: {
      const newIdentity = fromJS(action.identity);

      return state.update('identities', identities =>
        identities.push(newIdentity)
      );
    }
    case UPDATE_IDENTITY: {
      const { publicKeyHash } = action.identity;
      console.log('publicKeyHash, action.identity', action.identity.publicKeyHash, action.identity);
      const identities = state.get('identities');
      const indexFound = identities
        .findIndex((identity) => publicKeyHash === identity.get('publicKeyHash') );

      if ( indexFound > -1) {
        return state.set('identities', identities.set(indexFound, fromJS(action.identity)));
      }
      return state;
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
    case UPDATE_ACTIVATION_CODE:
      return state.set('activationCode', action.activationCode);
    case UPDATE_USERNAME:
      return state.set('username', action.username);
    case UPDATE_PASS_PHRASE:
      return state.set('passPhrase', action.passPhrase);
    case CONFIRM_PASS_PHRASE:
      return state.set('confirmedPassPhrase', action.passPhrase);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SELECT_ACCOUNT:
      return state
        .set('selectedAccountHash', action.selectedAccountHash)
        .set('selectedParentHash', action.selectedParentHash);
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

function createSelectedAccount({
  balance = 0,
  transactions = []
}) {
  return fromJS({ balance, transactions });
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