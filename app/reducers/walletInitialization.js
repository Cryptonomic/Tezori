import { Map } from 'immutable';

const SET_PASSWORD = 'SET_PASSWORD';
const SET_ADDRESS = 'SET_ADDRESS';

export const setPassword = (password) => {
  return {
    password,
    type: SET_PASSWORD,
  };
};

export const setAddress = (address) => {
  return {
    address,
    type: SET_ADDRESS,
  };
};

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
