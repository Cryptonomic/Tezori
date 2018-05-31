import { Map } from 'immutable';

const SET_PASSWORD = 'SET_PASSWORD';

export const setPassword = (password) => {
  return {
    password,
    type: SET_PASSWORD,
  };
};

const initState = Map({
  address: '',
  password: '',
});

export default function walletInitialization(state = initState, action) {
  switch (action.type) {
    case SET_PASSWORD:
      return state.set('password', action.password);
    default:
      return state;
  }
}
