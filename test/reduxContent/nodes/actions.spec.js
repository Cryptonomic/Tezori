import configureStore from 'redux-mock-store';

import * as actions from '../../../app/reduxContent/nodes/actions';

const mockStore = configureStore();
const store = mockStore();

beforeEach(() => {
  store.clearActions();
});

const expectedActions = {
  UPDATE_NODE: [{
    type: 'UPDATE_NODE',
    node: 'test',
  }],
  CLEAR_STATE: [{
    type: 'CLEAR_STATE',
  }],
  REMOVE_NODE: [{
    type: 'REMOVE_NODE',
    name: 'test',
  }],
  ADD_NODE: [{
    type: 'ADD_NODE',
    node: 'test',
  }],
  SET_SELECTED: [{
    type: 'SET_SELECTED',
    selected: 'test',
    target: 'test'

  }],
};

describe('Actions', () => {

  it('should return exact type payload', () => {
    store.dispatch(actions.clearState());
    expect(store.getActions()).toEqual(expectedActions['CLEAR_STATE']);
  });

  it('should return exact type and payload', () => {
    store.dispatch(actions.updateNode('test'));
    expect(store.getActions()).toEqual(expectedActions['UPDATE_NODE']);
  });

  it('should return exact type and payload', () => {
    store.dispatch(actions.removeNode('test'));
    expect(store.getActions()).toEqual(expectedActions['REMOVE_NODE']);
  });

  it('should return exact type and payload', () => {
    store.dispatch(actions.addNode('test'));
    expect(store.getActions()).toEqual(expectedActions['ADD_NODE']);
  });

  it('should return exact type and payload', () => {
    store.dispatch(actions.setSelected('test', 'test'));
    expect(store.getActions()).toEqual(expectedActions['SET_SELECTED']);
  });
})