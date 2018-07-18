import configureStore from 'redux-mock-store';

import * as actions from '../../../app/reduxContent/message/actions';

const mockStore = configureStore();
const store = mockStore();

beforeEach(() => {
  store.clearActions();
});

describe('Messages clear, create and logout', () => {
  it('should return exact type', () => {
    const expectedAction = [{
      type: 'CLEAR_MESSAGE_STATE'
    }]
    store.dispatch(actions.clearMessageState());
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should return exact type and payload', () => {
    const expectedAction = [{
      type: 'ADD_MESSAGE',
      message: 'test',
      isError: true,
      hash: 'hash'
    }]
    store.dispatch(actions.createMessage('test', true, 'hash'));
    expect(store.getActions()).toEqual(expectedAction);
  });
})