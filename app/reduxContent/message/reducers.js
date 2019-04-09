import { fromJS } from 'immutable';
import { LOGOUT } from '../wallet/types';
import { CLEAR_MESSAGE_STATE, ADD_MESSAGE, ADD_NEW_VERSION } from './types';

const emptyMessage = fromJS({
  message: '',
  isError: false,
  hash: '',
  localeParam: 0
});

const initState = fromJS({
  message: {},
  newVersion: ''
});

export default function messages(state = initState, action) {
  switch (action.type) {
    case ADD_MESSAGE: {
      const message = emptyMessage
        .set('message', action.message)
        .set('isError', action.isError)
        .set('hash', action.hash)
        .set('localeParam', action.localeParam);
      return state.set('message', message);
    }
    case ADD_NEW_VERSION:
      return state.set('newVersion', action.newVersion);
    case CLEAR_MESSAGE_STATE:
    case LOGOUT: {
      const newVersion = state.get('newVersion');
      return initState.set('newVersion', newVersion);
    }
    default:
      return state;
  }
}
