import { fromJS } from 'immutable';
import { flatten, find } from 'lodash';
import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import OPERATION_TYPES from '../constants/OperationTypes';

import { saveUpdatedWallet } from './walletInitialization.duck';
import { addMessage } from './message.duck';
import { changeDelegate, addParentKeysToAccounts } from './createAccount.duck';
import { displayError } from '../utils/formValidation';
import { awaitFor } from '../utils/general';

const {
  getOperationGroups,
  getAccounts,
  getOperationGroup,
  getAccount
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
export const addNewAccount = actionCreator(
  ADD_NEW_ACCOUNT,
  'publicKeyHash',
  'account'
);
const setSelectedAccount = actionCreator(
  SELECT_ACCOUNT,
  'selectedAccountHash',
  'selectedParentHash',
  'selectedAccount'
);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function selectDefaultAccountOrOpenModal() {
  return async (dispatch, state) => {
    const initWalletState = state().walletInitialization;
    const identities = initWalletState.getIn(['wallet', 'identities']);
    const network = initWalletState.get('network');

    if (identities.size === 0) {
      dispatch(openAddAddressModal());
    } else {
      const network = initWalletState.get('network');

      try {
        dispatch(setIsLoading(true));
        await Promise.all(
          identities.toJS().map(async identity => {
            const { publicKeyHash } = identity;
            const account = await getAccount(network, publicKeyHash);
            const { balance } = account.account;
            const operationGroups = await getOperationGroupsForAccount(
              network,
              publicKeyHash
            );
            const accounts = await getAccountsForIdentity(
              network,
              publicKeyHash
            );

            dispatch(
              addNewIdentity({
                transactions: [],
                ...identity,
                balance,
                operationGroups,
                accounts: formatAccounts(
                  addParentKeysToAccounts(accounts, identity)
                )
              })
            );

            const selectedAccount = createSelectedAccount({
              operationGroups,
              balance,
              transactions: []
            });

            dispatch(
              setSelectedAccount(publicKeyHash, publicKeyHash, selectedAccount)
            );
            dispatch(changeDelegate(publicKeyHash));
          })
        );
        const firstIdentityHash = identities.getIn([0, 'publicKeyHash']);

        await dispatch(selectAccount(firstIdentityHash, firstIdentityHash));
        dispatch(setIsLoading(false));
        dispatch(automaticAccountRefresh());
      } catch (e) {
        console.error(e);
        dispatch(addMessage(e.name, true));
        dispatch(setIsLoading(false));
      }
    }
  };
}

export function selectAccount(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {
    const network = state().walletInitialization.get('network');

    try {
      dispatch(setIsLoading(true));
      const account = await getAccount(network, selectedAccountHash);
      const operationGroups = await getOperationGroupsForAccount(
        network,
        selectedAccountHash
      );
      const managerOperationGroups = operationGroups.filter(({ kind }) => {
        return kind === OPERATION_TYPES.MANAGER;
      });

      const transactions = await Promise.all(
        managerOperationGroups.map(({ hash }) => {
          return getOperationGroup(network, hash).then(({ operations }) => {
            return operations.filter(
              ({ opKind }) => opKind === OPERATION_TYPES.TRANSACTION
            );
          });
        })
      );

      const flattenedTransactions = flatten(transactions);
      const selectedAccount = createSelectedAccount({
        transactions: flattenedTransactions,
        operationGroups,
        balance: account.account.balance
      });

      dispatch(
        setSelectedAccount(
          selectedAccountHash,
          selectedParentHash,
          selectedAccount
        )
      );
      dispatch(changeDelegate(selectedAccountHash));
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
      dispatch(setIsLoading(false));
    }
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

    if ( activeTab === GENERATE_MNEMONIC ) {
      const validations = [
        { value: passPhrase, type: 'minLength8', name: 'Pass Phrase'},
        { value: [passPhrase, confirmedPassPhrase], type: 'samePassPhrase', name: 'Pass Phrases'},
      ];

      const error = displayError(validations);
      if (error) {
        return dispatch(addMessage(error, true));
      }
    }

    try {
      dispatch(setIsLoading(true));
      switch (activeTab) {
        case PRIVATE_KEY:
          break;
        case GENERATE_MNEMONIC: {
          const {
            publicKeyHash,
            publicKey,
            privateKey
          } = await unlockIdentityWithMnemonic(seed, passPhrase);

          if (
            !find(identities.toJS(), { publicKeyHash, publicKey, privateKey })
          ) {
            dispatch(
              addNewIdentity({
                ...identity,
                balance: 0,
                operationGroups: [],
                accounts: []
              })
            );

            const updatedIdentities = state()
              .address.get('identities')
              .map(identity => {
                return {
                  publicKey: identity.get('publicKey'),
                  privateKey: identity.get('privateKey'),
                  publicKeyHash: identity.get('publicKeyHash')
                };
              });

            const selectedAccount = createSelectedAccount({
              balance: 0,
              operationGroups: [],
              transactions: []
            });

            dispatch(saveUpdatedWallet(updatedIdentities));
            dispatch(
              setSelectedAccount(
                identity.publicKeyHash,
                identity.publicKeyHash,
                selectedAccount
              )
            );
          } else {
            setImportDuplicationError(dispatch);
          }
          break;
        }
        case SEED_PHRASE:
        case FUNDRAISER:
        default: {
          let identity = {};
          if (activeTab === SEED_PHRASE) {
            identity = await unlockIdentityWithMnemonic(seed, passPhrase);
          } else {
            identity = await unlockFundraiserIdentity(
              seed,
              username,
              passPhrase
            );
          }
          const { publicKeyHash, publicKey, privateKey } = identity;
          let account = await getAccount(network, publicKeyHash).catch( () => false );

          if ( !account && activeTab === FUNDRAISER ) {
            const activating = await sendIdentityActivationOperation(network, identity, activationCode );
            if ( activating.operationGroupID ) {
              dispatch(addMessage('Account is being activated please hold', false));
              await awaitFor(60);
              account = await getAccount(network, publicKeyHash);
            }
          }

          let balance = 0;
          let operationGroups = {};
          let accounts = [];
          if (account) {
            balance = account.account.balance;
            operationGroups = await getOperationGroupsForAccount(
              network,
              publicKeyHash
            );
            accounts = await getAccountsForIdentity(network, publicKeyHash);
          }

          if (
            !find(identities.toJS(), { publicKeyHash, publicKey, privateKey })
          ) {
            dispatch(saveUpdatedWallet(fromJS([identity])));
            dispatch(
              addNewIdentity({
                transactions: [],
                ...identity,
                balance,
                operationGroups,
                accounts: formatAccounts(
                  addParentKeysToAccounts(accounts, identity)
                )
              })
            );
            const selectedAccount = createSelectedAccount({
              balance,
              operationGroups,
              transactions: []
            });

            dispatch(
              setSelectedAccount(publicKeyHash, publicKeyHash, selectedAccount)
            );
          } else {
            setImportDuplicationError(dispatch);
          }

          break;
        }
      }

      dispatch(clearState());
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
  selectedAccount: createSelectedAccount({}),
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
    case ADD_NEW_IDENTITY: {
      const newIdentity = fromJS(action.identity);

      return state.update('identities', identities =>
        identities.push(newIdentity)
      );
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
        .set('selectedParentHash', action.selectedParentHash)
        .set('selectedAccount', action.selectedAccount);
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
      return identity.set('accounts', fromJS(formatAccounts(accounts)));
    }
    return identity;
  });
}

function createSelectedAccount({
  balance = 0,
  operationGroups = [],
  transactions = []
}) {
  return fromJS({ balance, operationGroups, transactions });
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
    account_delegate: []
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
    account_delegate: []
  };

  return getAccounts(network, filter).then(accounts => {
    return accounts.filter(account => account.accountId !== id);
  });
}

function formatAccounts(accounts) {
  return accounts.map(account => ({
    operationGroups: [],
    transactions: [],
    ...account
  }));
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