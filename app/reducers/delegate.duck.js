import { fromJS } from 'immutable';
import { TezosOperations } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import request from '../utils/request';
import { addMessage } from './message.duck';


/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const UPDATE_DELEGATE_URL = 'UPDATE_DELEGATE_URL';
const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
const OPEN_CONFIRMATION_MODAL = 'OPEN_CONFIRMATION_MODAL';
const CLOSE_CONFIRMATION_MODAL = 'CLOSE_CONFIRMATION_MODAL';
const UPDATE_DELEGATE_IS_LOADING = 'UPDATE_DELEGATE_IS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const updatePassword = actionCreator(UPDATE_PASSWORD, 'password');
export const updateAddress = actionCreator(UPDATE_ADDRESS, 'address');
export const openConfirmationModal = actionCreator(OPEN_CONFIRMATION_MODAL);
export const closeConfirmationModal = actionCreator(CLOSE_CONFIRMATION_MODAL);
const updateIsLoading = actionCreator(UPDATE_DELEGATE_IS_LOADING, 'isLoading');
const clearState = actionCreator(CLEAR_STATE);

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function setOriginalAddress() {
  return async (dispatch, state) => {
    const walletState = state().walletInitialization;
    const originalAddress = walletState.get('address');
    dispatch(updateAddress(originalAddress));
  };
}

export function sendConfirmation() {
  return async (dispatch, state) => {
    const delegateState = state().delegate;
    const walletState = state().walletInitialization;
    const address = delegateState.get('address');
    const fee = delegateState.get('delegateFee');
    const network = walletState.get('network');
    const selectedAccount = state().address.get('selectedAccount');
    const keyStore = {
      publicKey: selectedAccount.get('publicKey'),
      privateKey: selectedAccount.get('privateKey'),
      publicKeyHash: selectedAccount.get('publicKeyHash')
    };

    console.log(network, keyStore, address, fee);

    try {
      dispatch(updateIsLoading(true));
      await TezosOperations.sendDelegationOperation(network, keyStore, address, fee);
      dispatch(clearState());
      dispatch(updateAddress(address));
      dispatch(updateIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
      dispatch(updateIsLoading(false));
    }
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  isConfirmationModalOpen: false,
  isLoading: false,
  password: '',
  address: '',
  delegateFee: 4.25
});

export default function delegate(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return initState;
    case UPDATE_PASSWORD:
      return state.set('password', action.password);
    case UPDATE_ADDRESS:
      return state.set('address', action.address);
    case OPEN_CONFIRMATION_MODAL:
      return state.set('isConfirmationModalOpen', true);
    case CLOSE_CONFIRMATION_MODAL:
      return state.set('isConfirmationModalOpen', false);
    case UPDATE_DELEGATE_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function postUpdateDelegate(body) {
  return request(UPDATE_DELEGATE_URL, 'POST', body);
}
