import { createMessage, addNewVersion } from './actions';

export function placeHolder() {
  // just noop
}

export function addMessage(message, isError, hash = '', localeParam = 0) {
  return dispatch => {
    dispatch(createMessage(message, isError, hash, localeParam));
  };
}

export function updateNewVersion(newVersion) {
  return dispatch => {
    dispatch(addNewVersion(newVersion));
  };
}
