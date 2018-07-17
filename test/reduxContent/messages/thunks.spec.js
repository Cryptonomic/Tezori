import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { addMessage } from '../../../app/reduxContent/message/thunks';
import * as actions from '../../../app/reduxContent/message/actions';

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const store = mockStore()

beforeEach(() => {
  store.clearActions();
});

describe('Thunk action', () => {
  it('should dispatch expected actions', () => {
    const expectedActions = [{
      type: 'ADD_MESSAGE',
      message: 'test',
      isError: true
    }];

    store.dispatch(addMessage('test', true));
    expect(store.getActions()).toEqual(expectedActions);


  })
});
