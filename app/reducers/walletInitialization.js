import { Map } from 'immutable';
import { push } from 'react-router-redux';

import actionCreator from '../utils/reduxHelpers';
import request from '../utils/request';
import CREATION_CONSTANTS from '../components/creationConstants';
const { DEFAULT } = CREATION_CONSTANTS;

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const POST_PASSWORD_URL = '/testing123';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_ADDRESS = 'SET_ADDRESS';
const SET_DISPLAY = 'SET_DISPLAY';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setAddress = actionCreator(SET_ADDRESS, 'address');
export const setDisplay = actionCreator(SET_DISPLAY, 'currentDisplay');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function submitAddress() {
  return async (dispatch, state) => {
    const address = state().walletInitialization.get('address');
    const password = state().walletInitialization.get('password');

    try {
      await postAddress(password, address);
      dispatch(setDisplay(DEFAULT));
      dispatch(push('/addresses'));
    } catch (e) {
      console.error(e);
    }
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = Map({
  address: '',
  currentDisplay: DEFAULT,
  password: '',
});

export default function walletInitialization(state = initState, action) {
  switch (action.type) {
    case SET_DISPLAY:
      return state.set('currentDisplay', action.currentDisplay);
    case SET_ADDRESS:
      return state.set('address', action.address);
    case SET_PASSWORD:
      return state.set('password', action.password);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */

function postAddress(password, address) {
  return Promise.resolve();
  // return request(POST_PASSWORD_URL, 'POST', { password, address });
}
