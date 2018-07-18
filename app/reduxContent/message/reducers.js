import { omit } from 'lodash';
import { fromJS } from 'immutable';
import { LOGOUT } from '../wallet/types';
import {
  CLEAR_MESSAGE_STATE,
  ADD_MESSAGE,
} from './types';


const emptyMessage = fromJS({
  message: '',
  isError: false,
  hash: ''
});

const initState = fromJS({
  message: {}
});

export default function messages(state = initState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE_STATE:
      return initState;
    case ADD_MESSAGE: {
      const message = emptyMessage
        .set('message', action.message)
        .set('isError', action.isError)
        .set('hash', action.hash);
      return state.set('message', message);
    }
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}