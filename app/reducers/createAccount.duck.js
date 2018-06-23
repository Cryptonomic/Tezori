import { fromJS } from 'immutable';
import { tezosOperations, tezosQuery } from '../conseil';

import actionCreator from '../utils/reduxHelpers';
import { addNewAccount } from './address.duck';
import { addMessage } from './message.duck';
import { displayError } from '../utils/formValidation';
import { tezToUtez } from '../utils/currancy';

const { getAccount } = tezosQuery;
const { sendOriginationOperation } = tezosOperations;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const CHANGE_AMOUNT = 'CHANGE_AMOUNT';
const CHANGE_DELEGATE = 'CHANGE_DELEGATE';
const CHANGE_FEE = 'CHANGE_FEE';
const TOGGLE_IS_CREATE_ACCOUNT_LOADING = 'TOGGLE_IS_CREATE_ACCOUNT_LOADING';
const OPEN_CREATE_ACCOUNT_MODAL = 'OPEN_CREATE_ACCOUNT_MODAL';
const CLOSE_CREATE_ACCOUNT_MODAL = 'CLOSE_CREATE_ACCOUNT_MODAL';
const CLEAR_CREATE_ACCOUNT_STATE = 'CLEAR_CREATE_ACCOUNT_STATE';
const SET_OPERATION = 'SET_OPERATION';
const UPDATE_PASS_PHRASE = 'UPDATE_ACCOUNT_PASS_PHRASE';
const CONFIRM_PASS_PHRASE = 'CONFIRM_ACCOUNT_PASS_PHRASE';

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
export const updatePassPhrase = actionCreator(UPDATE_PASS_PHRASE, 'passphrase');
export const confirmPassPhrase = actionCreator(
  CONFIRM_PASS_PHRASE,
  'confirmedpassphrase'
);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function createNewAccount() {
  return async (dispatch, state) => {
    const publicKeyHash = state().address.get('selectedParentHash');
    const delegate = state().createAccount.get('delegate');
    const amount = state().createAccount.get('amount');
    const parsedAmount = Number(amount.replace(/\,/g,''));
    const amountInUtez = tezToUtez(parsedAmount);
    const fee = state().createAccount.get('fee');

    const passPhrase = state().createAccount.get('passPhrase');
    const confirmedPassPhrase = state().createAccount.get(
      'confirmedPassPhrase'
    );
    const network = state().walletInitialization.get('network');

    const validations = [
      { value: amount, type: 'notEmpty', name: 'Amount'},
      { value: parsedAmount, type: 'validAmount'},
      { value: amountInUtez, type: 'posNum', name: 'Amount'},
      { value: passPhrase, type: 'notEmpty', name: 'Pass Phrase'},
      { value: passPhrase, type: 'minLength8', name: 'Pass Phrase' },
      { value: [passPhrase, confirmedPassPhrase], type: 'samePassPhrase', name: 'Pass Phrases' }
    ];

    const error = displayError(validations);
    if (error) {
      return dispatch(addMessage(error, true));
    }

    try {
      dispatch(setIsLoading(true));

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
        amountInUtez,
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
        balance: amountInUtez,
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
      dispatch(closeCreateAccountModal());
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
  operation: '',
  passPhrase: '',
  confirmedPassPhrase: ''
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
    case UPDATE_PASS_PHRASE:
      return state.set('passPhrase', action.passphrase);
    case CONFIRM_PASS_PHRASE:
      return state.set('confirmedPassPhrase', action.confirmedpassphrase);
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
