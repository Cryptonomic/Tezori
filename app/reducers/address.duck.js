import { fromJS } from 'immutable';

import actionCreator from '../utils/reduxHelpers';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import { tezos } from '../conseil';
import { getOperationGroups, getAccounts } from '../tezos/TezosQuery';

const {
  unlockFundraiserIdentity,
  generateMnemonic,
  unlockIdentityWithMnemonic,
  getBalance,
} = tezos;

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
export const selectAccount = actionCreator(SELECT_ACCOUNT, 'selectedAccountHash');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
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
            accounts,
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
});

export default function address(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return initState;
    case ADD_NEW_IDENTITY: {
      const newIdentity = fromJS({...action.identity, addresses: []});

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
      return state.set('selectedAccountHash', action.selectedAccountHash);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
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
