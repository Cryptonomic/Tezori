import { fromJS } from 'immutable';
import { flatten } from 'lodash';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import OPERATION_TYPES from '../constants/OperationTypes';
import { tezosWallet, tezosOperations, tezosQuery } from '../conseil';
import { saveUpdatedWallet } from './walletInitialization.duck';

const {
  getOperationGroups,
  getAccounts,
  getOperationGroup,
  getAccount,
} = tezosQuery;
const { sendOriginationOperation } = tezosOperations;
const {
  unlockFundraiserIdentity,
  generateMnemonic,
  unlockIdentityWithMnemonic,
} = tezosWallet;

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
const UPDATE_PASS_PHRASE = 'UPDATE_PASS_PHRASE';
const UPDATE_SEED = 'UPDATE_SEED';
const ADD_NEW_IDENTITY = 'ADD_NEW_IDENTITY';
const SELECT_ACCOUNT = 'SELECT_ACCOUNT';
const ADD_OPERATION_GROUPS_AND_TRANSACTIONS = 'ADD_OPERATION_GROUPS_AND_TRANSACTIONS';
const ADD_NEW_ACCOUNT = 'ADD_NEW_ACCOUNT';
const SELECT_DEFAULT_ACCOUNT = 'SELECT_DEFAULT_ACCOUNT ';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const clearEntireAddressState = actionCreator(CLEAR_ENTIRE_ADDRESS_STATE);
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
const addOperationGroupsAndTransactionsToAccount = actionCreator(ADD_OPERATION_GROUPS_AND_TRANSACTIONS, 'operationGroups', 'transactions');
const addNewAccount = actionCreator(ADD_NEW_ACCOUNT, 'publicKeyHash', 'account');
export const selectDefaultAccount = actionCreator(SELECT_DEFAULT_ACCOUNT);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function selectDefaultAccountOrOpenModal() {
  return async (dispatch, state) => {
    const initWalletState = state().walletInitialization;
    const identities = initWalletState.getIn(['wallet', 'identities']);
    console.log('identites', identities);
    const network = initWalletState.get('network');

    if (identities.size === 0) {
      dispatch(selectDefaultAccount());
      const selectedAccountHash = state().address.get('selectedAccountHash');

      if (!selectedAccountHash) dispatch(openAddAddressModal());
    } else {
      await Promise.all(identities.toJS().map(async (identity) => {
        const { publicKeyHash } = identity;
        const account = await getAccount(network, publicKeyHash);
        const { balance } = account.account;
        const operationGroups = await getOperationGroupsForAccount(network, publicKeyHash);
        const accounts = await getAccountsForIdentity(network, publicKeyHash);

        dispatch(addNewIdentity({
          transactions: [],
          ...identity,
          balance,
          operationGroups,
          accounts: formatAccounts(accounts),
        }));
        dispatch(setSelectedAccount(publicKeyHash));
      }));

      dispatch(automaticAccountRefresh());
    }
  };
}

export function createNewAccount(publicKeyHash, amount, delegate, spendable, delegatable, fee) {
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
      console.log('delegate', delegate);
      const newAccount = await sendOriginationOperation(
        network,
        keyStore,
        Number(amount),
        delegate,
        spendable === 'spendable_true',
        delegatable === 'delegatable_true',
        Number(fee)
      );
      console.log('newAccount?!?!?!?', newAccount);
      const newAccountHash = newAccount.results.operation_results[0].originated_contracts[0];
      const account = await getAccount(network, newAccountHash);

      console.log('account', account);
      dispatch(addNewAccount(publicKeyHash, account.account));
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

    try {
      dispatch(setIsLoading(true));
      const operationGroups = await getOperationGroupsForAccount(network, selectedAccountHash);
      const managerOperationGroups = operationGroups.filter(({ kind }) => {
        return kind === OPERATION_TYPES.MANAGER;
      });

      const transactions = await Promise.all(managerOperationGroups.map(({ hash }) => {
        return getOperationGroup(network, hash)
        .then(({ operations }) => {
          return operations.filter(({ opKind }) => opKind === OPERATION_TYPES.TRANSACTION);
        });
      }));


      const flattenedTransactions = flatten(transactions);

      dispatch(addOperationGroupsAndTransactionsToAccount(fromJS(operationGroups), fromJS(flattenedTransactions)));
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  }
}

let currentAccountRefreshInterval = null;

export function automaticAccountRefresh() {
  return (dispatch, state) => {
    const REFRESH_INTERVAL = 5 * 60 * 1000;
    if (currentAccountRefreshInterval) {
      clearAccountRefreshInterval();
    }

    currentAccountRefreshInterval = setInterval(() => {
      dispatch(selectAccount(state().address.get('selectedAccountHash')));
    }, REFRESH_INTERVAL);
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

          // TODO: push identity onto existing wallet
          dispatch(saveUpdatedWallet(identities));
          dispatch(setSelectedAccount(identity.publicKeyHash));
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
          const account = await getAccount(network, publicKeyHash);
          const { balance } = account.account;
          const operationGroups = await getOperationGroupsForAccount(network, publicKeyHash);
          const accounts = await getAccountsForIdentity(network, publicKeyHash);

          // TODO: push identity onto existing wallet
          dispatch(saveUpdatedWallet(fromJS([identity])));
          dispatch(addNewIdentity({
            transactions: [],
            ...identity,
            balance,
            operationGroups,
            accounts: formatAccounts(accounts),
          }));
          dispatch(setSelectedAccount(publicKeyHash));
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
const emptyAccount = fromJS({
  publicKey: '',
  privateKey: '',
  publicKeyHash: '',
  balance: 0,
  accounts: [],
  operationGroups: [],
  transactions: [],
});
const initState = fromJS({
  activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
  open: false,
  seed: '',
  username: '',
  passPhrase: '',
  privateKey: '',
  publicKey: '',
  isLoading: false,
  identities: [],
  selectedAccountHash: '',
  selectedAccount: emptyAccount,
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
      return state
        .set('identities', addNewAccountToIdentity(action.publicKeyHash, action.account, state.get('identities')));
    case ADD_OPERATION_GROUPS_AND_TRANSACTIONS: {
      const updatedAccount = state
        .get('selectedAccount')
        .set('operationGroups', action.operationGroups)
        .set('transactions', action.transactions);

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
      const identity = state.getIn(['identities', 0], emptyAccount);

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

  return getAccounts(network, filter)
    .then((accounts) => {
      return accounts.filter((account) => account.accountId !== id);
    });
}

function formatAccounts(accounts) {
  return accounts.map((account) => ({
    operationGroups: [],
    transactions: [],
    ...account,
  }));
}

export function clearAccountRefreshInterval() {
  clearInterval(currentAccountRefreshInterval);
}
