import { fromJS } from 'immutable';
import { TezosOperations, TezosConseilQuery } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import { addNewAccount } from './address.duck';
import { addMessage } from './message.duck';

const { getAccount } = TezosConseilQuery;
const { sendOriginationOperation } = TezosOperations;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const CHANGE_AMOUNT = 'CHANGE_AMOUNT';
const CHANGE_DELEGATE = 'CHANGE_DELEGATE';
const CHANGE_FEE = 'CHANGE_FEE';
const TOGGLE_IS_CREATE_ACCOUNT_LOADING = 'TOGGLE_IS_CREATE_ACCOUNT_LOADING';
const OPEN_CREATE_ACCOUNT_MODAL = 'OPEN_CREATE_ACCOUNT_MODAL';
const CLOSE_CREATE_ACCOUNT_MODAL = 'CLOSE_CREATE_ACCOUNT_MODAL';
const CLEAR_CREATE_ACCOUNT_STATE = 'CLEAR_CREATE_ACCOUNT_STATE';
const SET_OPERATION = 'SET_OPERATION';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const changeAmount = actionCreator(CHANGE_AMOUNT, 'amount');
export const changeDelegate = actionCreator(CHANGE_DELEGATE, 'delegate');
export const changeFee = actionCreator(CHANGE_FEE, 'fee');
const setIsLoading = actionCreator(
  TOGGLE_IS_CREATE_ACCOUNT_LOADING,
  'isLoading'
);
export const openCreateAccountModal = actionCreator(OPEN_CREATE_ACCOUNT_MODAL);
export const closeCreateAccountModal = actionCreator(
  CLOSE_CREATE_ACCOUNT_MODAL
);
export const setOperation = actionCreator(SET_OPERATION, 'operation');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function createNewAccount() {
  return async (dispatch, state) => {
    try {
      dispatch(setIsLoading(true));
      const publicKeyHash = state().address.get('selectedParentHash');
      const delegate = state().createAccount.get('delegate');
      const amount = state().createAccount.get('amount');
      const fee = state().createAccount.get('fee');
      const network = state().walletInitialization.get('network');

      const identity = findKeyStore(
        publicKeyHash,
        state().address.get('identities')
      );
      const publicKey = identity.get('publicKey');
      const privateKey = identity.get('privateKey');
      const keyStore = { publicKey, privateKey, publicKeyHash };
      // sendOriginationOperation(network: string, keyStore: KeyStore, amount: number, delegate: string, spendable: bool, delegatable: bool, fee: number)
      const newAccount = await sendOriginationOperation(
        network,
        keyStore,
        Number(amount),
        delegate,
        true,
        true,
        fee
      );

      dispatch(setOperation(newAccount.operation));
      const newAccountHash =
        newAccount.results.operation_results[0].originated_contracts[0];
      const tmpAccount = {
        accountId: newAccountHash,
        balance: Number(amount),
        delegateValue: delegate,
        manager: delegate,
        isReady: false,
        delegateSetable: true,
        script: null
      };
      //  const account = await getAccount(network, newAccountHash);

      dispatch(
        addNewAccount(
          publicKeyHash,
          addParentKeysToAccount(tmpAccount, identity.toJS())
        )
      );
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
  amount: '',
  delegate: '', // TODO: set this to the selectedAccountHash to start
  fee: 100,
  isLoading: false,
  isModalOpen: false,
  operation: ''
});

export default function createAccount(state = initState, action) {
  switch (action.type) {
    case CLEAR_CREATE_ACCOUNT_STATE:
      return initState;
    case CLOSE_CREATE_ACCOUNT_MODAL:
      return state.set('isModalOpen', false);
    case OPEN_CREATE_ACCOUNT_MODAL:
      return state.set('isModalOpen', true);
    case TOGGLE_IS_CREATE_ACCOUNT_LOADING:
      return state.set('isLoading', action.isLoading);
    case CHANGE_FEE:
      return state.set('fee', action.fee);
    case CHANGE_DELEGATE:
      return state.set('delegate', action.delegate);
    case CHANGE_AMOUNT:
      return state.set('amount', action.amount);
    case SET_OPERATION:
      return state.set('operation', action.operation);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
// publicKeyHash -> [identity] -> keyStore
export function findKeyStore(publicKeyHash, identities) {
  return identities.find(identity => {
    return identity.get('publicKeyHash') === publicKeyHash;
  });
}

export function addParentKeysToAccount(account, identity) {
  return {
    ...account,
    publicKey: identity.publicKey,
    privateKey: identity.privateKey
  };
}

export function addParentKeysToAccounts(accounts, identity) {
  return accounts.map(account => addParentKeysToAccount(account, identity));
}
