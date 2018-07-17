import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';
import Immutable from 'immutable';

import messages from '../../../app/reduxContent/message/reducers';
import * as actions from '../../../app/reduxContent/message/actions';
import { logout } from '../../../app/reduxContent/wallet/actions';

const initState = fromJS({
  message: {},
})

const initStateImmutable = Immutable.Map({});

const messageTest =  Immutable.Map({
  message: 'test',
  isError: true
});

const addMessage = Immutable.Map(initState).set('message', messageTest);

const expectedState = {     
  LOGOUT: initState,
  CLEAR_MESSAGE_STATE: initState,
  ADD_MESSAGE: addMessage

}

beforeEach(function () {
  jest.addMatchers(matchers);
});

describe('action type CLEAR_MESSAGE_STATE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.clearMessageState())).toEqualImmutable(expectedState['CLEAR_MESSAGE_STATE']);
    });
  });

  describe('action type ADD_MESSAGE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.createMessage('test',true))).toEqualImmutable(expectedState['ADD_MESSAGE']);
    });
  });

  describe('action type LOGOUT', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, logout())).toEqualImmutable(expectedState['LOGOUT']);
    });
  });