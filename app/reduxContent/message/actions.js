import {
  CLEAR_MESSAGE_STATE,
  ADD_MESSAGE
} from './types';
import actionCreator from '../../utils/reduxHelpers';
export const clearMessageState = actionCreator(CLEAR_MESSAGE_STATE);
export const createMessage = actionCreator(ADD_MESSAGE, 'message', 'isError');
