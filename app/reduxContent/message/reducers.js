import { omit } from 'lodash';
import Immutable from 'immutable';
import { fromJS } from 'immutable';
import { LOGOUT } from '../wallet/types';
import {
  CLEAR_MESSAGE_STATE,
  ADD_MESSAGE,
} from './types';


const emptyMessage = Immutable.Map({
  message: '',
  isError: false
});

const ImmutableState = Immutable.Map({})

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
        .set('isError', action.isError);
      return ImmutableState.set('message', message);
    }
    case LOGOUT:
      return initState;
    default:
      return state;
  }
}