import { fromJS } from 'immutable';

import actionCreator from '../utils/reduxHelpers';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_MESSAGE_STATE = 'CLEAR_MESSAGE_STATE';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const clearMessageState = actionCreator(CLEAR_MESSAGE_STATE);
const createMessage = actionCreator(ADD_MESSAGE, 'message', 'isError');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function addMessage(message, isError) {
  return (dispatch) => {
    dispatch(createMessage(message, isError));
  };
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const emptyMessage = fromJS({
  message: '',
  isError: false,
});
const initState = fromJS({
  message: {},
});

export default function messages(state = initState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE_STATE:
      return initState;
    case ADD_MESSAGE: {
      const message = emptyMessage
        .set('message', action.message)
        .set('isError', action.isError);

      return state.set('message', message)
    }
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
