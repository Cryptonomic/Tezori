import configureStore from 'redux-mock-store';

import * as actions from '../../../app/reduxContent/settings/actions';

const mockStore = configureStore();
const store = mockStore();

beforeEach(() => {
  store.clearActions();
});

describe('Actions', () => {

  it('should return exact type payload', () => {
    const expectedAction = [{
      type: 'CLEAR_STATE',
    }];

    store.dispatch(actions.clearState());
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should return exact type and node ', () => {
    const expectedAction = [{
      type: 'UPDATE_NODE',
      node: 'test',
    }];

    store.dispatch(actions.updateNode('test'));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should return exact type and name', () => {
    const expectedAction = [{
      type: 'REMOVE_NODE',
      name: 'test',
    }];
    store.dispatch(actions.removeNode('test'));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should return exact type and node', () => {
    const expectedAction =  [{
      type: 'ADD_NODE',
      node: 'test',
    }];
    store.dispatch(actions.addNode('test'));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should return exact type, selected and target', () => {
    const expectedAction = [{
      type: 'SET_SELECTED',
      selected: 'test',
      target: 'test'
    }];
    store.dispatch(actions.setSelected('test', 'test'));
    expect(store.getActions()).toEqual(expectedAction);
  });
})