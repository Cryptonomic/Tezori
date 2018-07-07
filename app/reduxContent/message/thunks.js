import {
  createMessage
} from './actions';

export function addMessage(message, isError) {
  return dispatch => {
    dispatch(createMessage(message, isError));
  };
}