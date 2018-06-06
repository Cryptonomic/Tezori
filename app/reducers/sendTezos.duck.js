import { fromJS } from 'immutable';

import actionCreator from '../utils/reduxHelpers';
import { sendTransactionOperation } from '../tezos/TezosQuery';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
const UPDATE_TO_ADDRESS = 'UPDATE_TO_ADDRESS';
const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
const UPDATE_FEE = 'UPDATE_FEE';
const OPEN_SEND_TEZOS_MODAL = 'OPEN_SEND_TEZOS_MODAL';
const CLOSE_SEND_TEZOS_MODAL = 'CLOSE_SEND_TEZOS_MODAL';
const UPDATE_SEND_TEZOS_LOADING = 'UPDATE_SEND_TEZOS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const updatePassword = actionCreator(UPDATE_PASSWORD, 'password');
export const updateToAddress = actionCreator(UPDATE_TO_ADDRESS, 'toAddress');
export const updateAmount = actionCreator(UPDATE_AMOUNT, 'amount');
export const updateFee = actionCreator(UPDATE_FEE, 'fee');
export const openSendTezosModal = actionCreator(OPEN_SEND_TEZOS_MODAL);
export const closeSendTezosModal = actionCreator(CLOSE_SEND_TEZOS_MODAL);
const updateSendTezosLoading = actionCreator(UPDATE_SEND_TEZOS_LOADING, 'isLoading');
const clearState = actionCreator(CLEAR_STATE);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function sendConfirmation() {
  return async (dispatch, state) => {
    const sendTezosState = state().sendTezos;
    const walletState = state().walletInitialization;
    const password = sendTezosState.get('password');
    const walletPassword = walletState.get('password');
    const toAddress = sendTezosState.get('toAddress');
    const amount = sendTezosState.get('amount');
    const fee = sendTezosState.get('fee');
    const fromAddress = walletState.get('address');
    const network = sendTezosState.get('network');

    if (password === walletPassword) {
      try {
        dispatch(updateSendTezosLoading(true));
        await sendTransactionOperation(network, fromAddress, toAddress, amount, fee);
        dispatch(clearState());
        dispatch(updateSendTezosLoading(false));
      } catch (e) {
        console.error(e);
        dispatch(updateSendTezosLoading(false));
      }
    }
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  isConfirmationModalOpen: false,
  isLoading: false,
  password: '',
  toAddress: '',
  amount: 0,
  fee: 0,
  network: '',
});

export default function sendTezos(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return initState;
    case UPDATE_AMOUNT:
      return state.set('amount', action.amount);
    case UPDATE_PASSWORD:
      return state.set('password', action.password);
    case UPDATE_TO_ADDRESS:
      return state.set('toAddress', action.toAddress);
    case UPDATE_FEE:
      return state.set('fee', action.fee);
    case OPEN_SEND_TEZOS_MODAL:
      return state.set('isConfirmationModalOpen', true);
    case CLOSE_SEND_TEZOS_MODAL:
      return state.set('isConfirmationModalOpen', false);
    case UPDATE_SEND_TEZOS_LOADING:
      return state.set('isLoading', action.isLoading);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
