import { fromJS } from 'immutable';
import { TezosOperations } from 'conseiljs';

import actionCreator from '../utils/reduxHelpers';
import request from '../utils/request';
import { addMessage } from './message.duck';
import { LOGOUT } from '../redux/wallet/types';
import { displayError } from '../utils/formValidation';
import { getSelectedKeyStore } from '../utils/general';
import { getSelected } from '../utils/nodes';
import { TEZOS } from '../constants/NodesTypes';

const {
  sendDelegationOperation
} = TezosOperations;

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
export function showConfirmationModal() {
  return async (dispatch, state) => {
    const address = state().delegate.get('address');

    const validations = [
      { value: address, type: 'notEmpty', name: 'Address' },
      { value: address, type: 'validAddress' }
    ];

    const error = displayError(validations);
    if (error) {
      return dispatch(addMessage(error, true));
    }

    dispatch(openConfirmationModal());
  };
}

export function sendConfirmation() {
  return async (dispatch, state) => {
    const delegateState = state().delegate;
    const address = delegateState.get('address');
    const identities = state().address.get('identities').toJS();
    const fee = delegateState.get('delegateFee');
    const nodes = state().nodes.toJS();
    const selectedAccountHash = state().address.get('selectedAccountHash');
    const selectedParentHash = state().address.get('selectedParentHash');
    try {
      dispatch(updateIsLoading(true));
      const keyStore = getSelectedKeyStore(identities, selectedAccountHash, selectedParentHash);
      const { url, apiKey } = getSelected(nodes, TEZOS);
      console.log('debug - jjjjj - url, apiKey', url, apiKey);
      const operation = await sendDelegationOperation(url, keyStore, address, fee).catch((err) => {
        err.name = err.message;
        throw err;
      });

      dispatch(addMessage(
        `Successfully sent delegation operation ${operation.operationGroupID}.`,
        false
      ));

      dispatch(clearState());
      dispatch(updateAddress(address));
    } catch (e) {
      console.error(e);
      dispatch(addMessage(e.name, true));
    }

    dispatch(updateIsLoading(false));
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  isConfirmationModalOpen: false,
  isLoading: false,
  password: '',
  address: '',
  delegateFee: '100'
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
      const address = state.get('address');
      return initState.set('address', address);
      break;
    case UPDATE_DELEGATE_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function postUpdateDelegate(body) {
  return request(UPDATE_DELEGATE_URL, 'POST', body);
}
