import messages from '../../../app/reduxContent/message/reducers';
import * as actions from '../../../app/reduxContent/message/actions';
import { logout } from '../../../app/reduxContent/wallet/actions';


describe('action type CLEAR_MESSAGE_STATE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.clearMessageState())).toMatchSnapshot();
    });
  });

  describe('action type ADD_MESSAGE', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, actions.createMessage('test',true))).toMatchSnapshot();
    });
  });

  describe('action type LOGOUT', () => {
    test('returns the correct state', () => {  
      expect(messages(undefined, logout())).toMatchSnapshot();
    });
  });