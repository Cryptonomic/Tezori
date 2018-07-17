import { fromJS } from 'immutable';

import messages from '../../../app/reduxContent/message/reducers';
import * as actions from '../../../app/reduxContent/message/actions';
import { logout } from '../../../app/reduxContent/wallet/actions';

const initState = fromJS({
  message: {},
})

const messageTest = fromJS({
  message: 'test',
  isError: true,
  hash: 'hash'
});

const expectedState = {     
  LOGOUT: initState,
  CLEAR_MESSAGE_STATE: initState,
  ADD_MESSAGE: initState.set('message', messageTest),
}

describe('action type CLEAR_MESSAGE_STATE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.clearMessageState())).toEqual(expectedState['CLEAR_MESSAGE_STATE']); 
    });
  });

  describe('action type ADD_MESSAGE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.createMessage('test', true, 'hash'))).toEqual(expectedState['ADD_MESSAGE']); 
    });
  });

  describe('action type LOGOUT', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, logout())).toEqual(expectedState['LOGOUT']); 
    });
  });