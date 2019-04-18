import { CLEAR_MESSAGE_STATE, ADD_MESSAGE, ADD_NEW_VERSION } from './types';
import actionCreator from '../../utils/reduxHelpers';

export const clearMessageState = actionCreator(CLEAR_MESSAGE_STATE);
export const createMessage = actionCreator(
  ADD_MESSAGE,
  'message',
  'isError',
  'hash',
  'localeParam'
);

export const addNewVersion = actionCreator(ADD_NEW_VERSION, 'newVersion');
