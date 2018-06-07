import { fromJS } from 'immutable';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import { getOperationGroups, getAccounts } from '../tezos/TezosQuery';
import { sendOriginationOperation } from '../tezos/TezosOperations';
import {
  unlockFundraiserIdentity,
  generateMnemonic,
  unlockIdentityWithMnemonic,
  getBalance,
} from '../tezos/TezosWallet';
import { saveUpdatedWallet } from './walletInitialization.duck';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const OPEN_ADD_ADDRESS_MODAL = 'OPEN_ADD_ADDRESS_MODAL';
const CLOSE_ADD_ADDRESS_MODAL = 'CLOSE_ADD_ADDRESS_MODAL';
const SET_ACTIVE_ADD_ADDRESS_TAB = 'SET_ACTIVE_ADD_ADDRESS_TAB';
const SET_IS_LOADING = 'SET_IS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';
const UPDATE_PRIVATE_KEY = 'UPDATE_PRIVATE_KEY';
const UPDATE_PUBLIC_KEY = 'UPDATE_PUBLIC_KEY';
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_PASS_PHRASE = 'UPDATE_PASS_PHRASE';
const UPDATE_SEED = 'UPDATE_SEED';
const ADD_NEW_IDENTITY = 'ADD_NEW_IDENTITY';
const SELECT_ACCOUNT = 'SELECT_ACCOUNT';
const ADD_OPERATION_GROUPS = 'ADD_OPERATION_GROUPS';
const ADD_NEW_ACCOUNT = 'ADD_NEW_ACCOUNT';
const SELECT_DEFAULT_ACCOUNT = 'SELECT_DEFAULT_ACCOUNT ';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const openAddAddressModal = actionCreator(OPEN_ADD_ADDRESS_MODAL);
export const closeAddAddressModal = actionCreator(CLOSE_ADD_ADDRESS_MODAL);
const updateActiveTab = actionCreator(SET_ACTIVE_ADD_ADDRESS_TAB, 'activeTab');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const clearState = actionCreator(CLEAR_STATE);
export const updatePrivateKey = actionCreator(UPDATE_PRIVATE_KEY, 'privateKey');
export const updatePublicKey = actionCreator(UPDATE_PUBLIC_KEY, 'publicKey');
export const updateUsername = actionCreator(UPDATE_USERNAME, 'username');
export const updatePassPhrase = actionCreator(UPDATE_PASS_PHRASE, 'passPhrase');
export const updateSeed = actionCreator(UPDATE_SEED, 'seed');
export const addNewIdentity = actionCreator(ADD_NEW_IDENTITY, 'identity');
const setSelectedAccount = actionCreator(SELECT_ACCOUNT, 'selectedAccountHash');
const addOperationGroupsToAccount = actionCreator(ADD_OPERATION_GROUPS, 'operationGroups');
const addNewAccount = actionCreator(ADD_NEW_ACCOUNT, 'publicKeyHash', 'account');
export const selectDefaultAccount = actionCreator(SELECT_DEFAULT_ACCOUNT);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function createNewAccount(publicKeyHash) {
  return async (dispatch, state) => {
    try {
      dispatch(setIsLoading(true));
      const network = state().walletInitialization.get('network');
      const identity = findSelectedAccount(publicKeyHash, state().address.get('identities'));
      const keyStore = {
        publicKey: identity.get('publicKey'),
        privateKey: identity.get('privateKey'),
        publicKeyHash,
      };
      // sendOriginationOperation(network: string, keyStore: KeyStore, amount: number, delegate: string, spendable: bool, delegatable: bool, fee: number)
      const newAccount = await sendOriginationOperation(network, keyStore, 0, 'delegate', true, false, 3);
      console.log('newAccount?!?!?!?', newAccount);
      dispatch(addNewAccount(publicKeyHash, newAccount));
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  };
}

export function selectAccount(selectedAccountHash) {
  return async (dispatch, state) => {
    const network = state().walletInitialization.get('network');

    dispatch(setSelectedAccount(selectedAccountHash));

    if (state().address.getIn(['selectedAccount', 'operationGroups']).size === 0) {
      try {
        dispatch(setIsLoading(true));
        const operationGroups = await getOperationGroupsForAccount(network, selectedAccountHash);

        dispatch(addOperationGroupsToAccount(operationGroups));
        dispatch(setIsLoading(false));
      } catch (e) {
        console.error(e);
        dispatch(setIsLoading(false));
      }
    }

  }
}

export function setActiveTab(activeTab) {
  return async (dispatch) => {
    const { GENERATE_MNEMONIC } = ADD_ADDRESS_TYPES;

    dispatch(updateActiveTab(activeTab));

    if (activeTab === GENERATE_MNEMONIC) {
      try {
        dispatch(setIsLoading(true));
        const seed = await generateMnemonic();

        dispatch(setIsLoading(false));
        dispatch(updateSeed(seed));
      } catch (e) {
        console.error(e);
        dispatch(setIsLoading(false));
      }
    }
  }
}

export function importAddress() {
  return async (dispatch, state) => {
    const {
      FUNDRAISER,
      SEED_PHRASE,
      PRIVATE_KEY,
      GENERATE_MNEMONIC,
    } = ADD_ADDRESS_TYPES;
    const activeTab = state().address.get('activeTab');
    const seed = state().address.get('seed');
    const username = state().address.get('username');
    const passPhrase = state().address.get('passPhrase');
    const network = state().walletInitialization.get('network');

    try {
      dispatch(setIsLoading(true));
      switch(activeTab) {
        case PRIVATE_KEY:
          break;
        case GENERATE_MNEMONIC: {
          const identity = await unlockIdentityWithMnemonic(seed, passPhrase);

          dispatch(addNewIdentity({
            ...identity,
            balance: 0,
            operationGroups: [],
            accounts: [],
          }));

          const identities = state().address.get('identities').map((identity) => {
            return {
              publicKey: identity.get('publicKey'),
              privateKey: identity.get('privateKey'),
              publicKeyHash: identity.get('publicKeyHash'),
            };
          });
          dispatch(saveUpdatedWallet(identities));
          break;
        }
        case SEED_PHRASE:
        case FUNDRAISER:
        default: {
          let identity = {};
          if (activeTab === SEED_PHRASE) {
            identity = await unlockIdentityWithMnemonic(seed, passPhrase);
          } else {
            identity = await unlockFundraiserIdentity(seed, username, passPhrase);
          }
          const { publicKeyHash } = identity;
          const balance = await getBalance(publicKeyHash, network);
          const operationGroups = await getOperationGroupsForAccount(network, publicKeyHash);
          const accounts = await getAccountsForIdentity(network, publicKeyHash);

          dispatch(addNewIdentity({
            ...identity,
            balance,
            operationGroups,
            accounts: formatAccounts(accounts),
          }));
          break;
        }
      }
      dispatch(clearState());
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const accountBlocks1 = {
  publicKey: 'e09fa0ti3j40tgsdjfgj',
  privateKey: 'faoe9520qejfoifgmsdjfg',
  publicKeyHash: 'tz1293asdjo2109sd',
  balance: 502.123,
  accounts: [
    {balance: 4.21, accountId: 'TZ1023rka0d9f234', operationGroups: []},
    {balance: 2.1, accountId: 'TZ1230rkasdofi123', operationGroups: []},
    {balance: 3.0, accountId: 'TZ1zs203rtkasodifg', operationGroups: []},
  ],
  operationGroups: [],
};
const accountBlocks2 = {
  publicKey: '1203sdoijfo2i3j4osdjfal',
  privateKey: '1209asdifok12034ksodfk',
  publicKeyHash: 'tz19w0aijsdoijewoqiwe',
  balance: 104.98,
  accounts: [
    {balance: 5.95, accountId: 'TZ109eqrjgeqrgadf', operationGroups: []},
    {balance: 1.1, accountId: 'TZ1029eskadf1i23j4jlo', operationGroups: []},
    {balance: 4.25, accountId: 'TZ101293rjaogfij1324g', operationGroups: []},
  ],
  operationGroups: [],
};
const initState = fromJS({
  activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
  open: false,
  seed: '',
  username: '',
  passPhrase: '',
  privateKey: '',
  publicKey: '',
  isLoading: false,
  identities: [accountBlocks1, accountBlocks2],
  selectedAccountHash: '',
  selectedAccount: {},
});

export default function address(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE: {
      const identities = state.get('identities');
      const selectedAccountHash = state.get('selectedAccountHash');

      return initState
      .set('identities', identities)
      .set('selectedAccountHash', selectedAccountHash);
    }
    case ADD_NEW_ACCOUNT:
      return state
        .set('identities', addNewAccountToIdentity(action.publicKeyHash, action.account, state.get('identities')));
    case ADD_OPERATION_GROUPS: {
      const updatedAccount = state.get('selectedAccount').set('operationGroups', action.operationGroups);

      return state.set('selectedAccount', updatedAccount)
        .set('identities', findAndUpdateIdentities(updatedAccount, state.get('identities')));
    }
    case ADD_NEW_IDENTITY: {
      const newIdentity = fromJS(action.identity);

      return state.update('identities', identities => identities.push(newIdentity));
    }
    case CLOSE_ADD_ADDRESS_MODAL:
      return state.set('open', false);
    case OPEN_ADD_ADDRESS_MODAL:
      return state.set('open', true);
    case SET_ACTIVE_ADD_ADDRESS_TAB:
      return state
        .set('activeTab', action.activeTab)
        .set('seed', '');
    case UPDATE_PRIVATE_KEY:
      return state.set('privateKey', action.privateKey);
    case UPDATE_PUBLIC_KEY:
      return state.set('publicKey', action.publicKey);
    case UPDATE_SEED:
      return state.set('seed', action.seed);
    case UPDATE_USERNAME:
      return state.set('username', action.username);
    case UPDATE_PASS_PHRASE:
      return state.set('passPhrase', action.passPhrase);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case SELECT_ACCOUNT:
      return state
        .set('selectedAccountHash', action.selectedAccountHash)
        .set('selectedAccount', findSelectedAccount(action.selectedAccountHash, state.get('identities')));
    case SELECT_DEFAULT_ACCOUNT: {
      const identity = state.getIn(['identities', 0], {});

      return state
        .set('selectedAccountHash', identity.get('publicKeyHash', ''))
        .set('selectedAccount', identity)
    }
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function addNewAccountToIdentity(publicKeyHash, account, identities) {
  return identities.map((identity) => {
    if (identity.get('publicKeyHash') === publicKeyHash) {
      const accounts = identity.get('accounts');

      return identity.set('accounts', formatAccounts(accounts.push(account)));
    }
    return identity;
  });
}

function findAndUpdateIdentities(updatedAccount, identities) {
  if (updatedAccount.has('publicKeyHash')) {
    return identities.map((identity) => {
      if (identity.get('publicKeyHash') === updatedAccount.get('publicKeyHash')) {
        return updatedAccount;
      }
      return identity;
    });
  }

  return identities.map((identity) => {
    const accounts = identity.get('accounts').map((account) => {
      if (account.get('accountId') === updatedAccount.get('accountId')) {
        return updatedAccount;
      }
      return account;
    });

    return identity.set('accounts', accounts);
  });
}

function findSelectedAccount(hash, identities) {
  const identityTest = RegExp('^tz*');

  if (identityTest.test(hash)) {
    return identities.find((identity) => {
      return identity.get('publicKeyHash') === hash;
    });
  }

  let foundAccount = {};

  identities.find((identity) => {
    foundAccount = identity.get('accounts').find((account) => {
      return account.get('accountId') === hash;
    });

    return !!foundAccount;
  });

  return foundAccount;
}

function getOperationGroupsForAccount(network, id) {
  const filter = {
    limit: 100,
    block_id: [],
    block_level: [],
    block_netid: [],
    block_protocol: [],
    operation_id: [],
    operation_source: [id],
    operation_group_kind: [],
    operation_kind: [],
    account_id: [],
    account_manager: [],
    account_delegate: [],
  };

  return getOperationGroups(network, filter);
}

function getAccountsForIdentity(network, id) {
  const filter = {
      limit: 100,
      block_id: [],
      block_level: [],
      block_netid: [],
      block_protocol: [],
      operation_id: [],
      operation_source: [],
      operation_group_kind: [],
      operation_kind: [],
      account_id: [],
      account_manager: [id],
      account_delegate: [],
  };

  return getAccounts(network, filter);
}

function formatAccounts(accounts) {
  return accounts.map((account) => ({ operationGroups: [], ...account }));
}
