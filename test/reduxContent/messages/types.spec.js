import * as types from '../../../app/reduxContent/message/types';

describe('Type name', () => {
    it('should be equal to declared const', () => {
      expect(types.ADD_MESSAGE).toEqual('ADD_MESSAGE');
    });
  
    it('should be equal to declared const', () => {
        expect(types.CLEAR_MESSAGE_STATE).toEqual('CLEAR_MESSAGE_STATE');
    });
  })