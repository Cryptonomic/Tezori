import { Map } from 'immutable';
import actionCreator from '../utils/reduxHelpers';

const SET_PASSWORD = 'SET_PASSWORD';
const SET_ADDRESS = 'SET_ADDRESS';

export const setPassword = actionCreator(SET_PASSWORD, 'password');
export const setAddress = actionCreator(SET_ADDRESS, 'address');

const initState = Map({
  address: '',
  password: '',
});

export default function walletInitialization(state = initState, action) {
  switch (action.type) {
    case SET_ADDRESS:
      return state.set('address', action.address);
    case SET_PASSWORD:
      return state.set('password', action.password);
    default:
      return state;
  }
}
