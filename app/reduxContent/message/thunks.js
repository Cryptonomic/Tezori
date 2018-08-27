import { createMessage } from './actions';

export function placeHolder() {
  // just noop
}

export function addMessage(message, isError, hash = '', localeParam?) {
  return dispatch => {
    dispatch(createMessage(message, isError, hash, localeParam));
  };
}
