import { fromJS } from 'immutable';
import { TezosOperations, TezosConseilQuery } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import { addNewAccount } from './address.duck';
import { addMessage } from './message.duck';
import { displayError } from '../utils/formValidation';
import { tezToUtez } from '../utils/currancy';
import { createAccount as createAccountTmp } from '../utils/account';
import { revealKey } from '../utils/general'

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

export const clearCreateAccountState = actionCreator(
  CLEAR_CREATE_ACCOUNT_STATE
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
      {
        value: [passPhrase, confirmedPassPhrase],
        type: 'samePassPhrase',
        name: 'Pass Phrases'
      }
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

      await revealKey(network, keyStore, fee).catch((err) => {
        err.name = err.message;
        throw err;
      });

      const newAccount = await sendOriginationOperation(
        network,
        keyStore,
        amountInUtez,
        delegate,
        true,
        true,
        fee
      ).catch((err) => {
        err.name = err.message;
        throw err;
      });

      const newAccountHash =
        newAccount.results.contents[0].metadata.operation_result.originated_contracts[0];

      dispatch(
        addNewAccount(
          publicKeyHash,
          createAccountTmp({
              accountId: newAccountHash,
              balance: amountInUtez,
              manager: delegate
            },
            identity.toJS()
          )
        )
      );
      dispatch(clearCreateAccountState());
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
