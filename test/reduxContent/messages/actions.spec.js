import configureStore from 'redux-mock-store';

import * as actions from '../../../app/reduxContent/message/actions';

const mockStore = configureStore();
const store = mockStore();

beforeEach(() => {
  store.clearActions();
});

const expectedActions = {
  ADD_MESSAGE: [{
    type: 'ADD_MESSAGE',
    message: 'test',
    isError: true
  }],
  CLEAR_MESSAGE_STATE: [{
    type: 'CLEAR_MESSAGE_STATE',
  }]
};

describe('Messages clear and create', () => {
  it('should return exact type', () => {
    store.dispatch(actions.clearMessageState());
    expect(store.getActions()).toEqual(expectedActions['CLEAR_MESSAGE_STATE']);
  });

  it('should return exact type and payload', () => {
    store.dispatch(actions.createMessage('test', true));
    expect(store.getActions()).toEqual(expectedActions['ADD_MESSAGE']);
  });
})