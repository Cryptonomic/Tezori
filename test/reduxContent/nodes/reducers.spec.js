import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import nodes, { initialState } from '../../../app/reduxContent/nodes/reducers';
import * as actions from '../../../app/reduxContent/nodes/actions';

const initState = fromJS(initialState);

beforeEach(function () {
  jest.addMatchers(matchers);
});

describe('nodes default reducer', () => {

  it('should return default for unknown action', () => {
    expect(nodes(undefined, {})).toEqualImmutable(initState);
  });

});

describe('nodes CLEAR_STATE reducer', () => {

  test('should return initState', () => {
    const expectedState = initState;
    expect(nodes(undefined, actions.clearState())).toEqualImmutable(expectedState);
  });

});

describe('nodes SET_SELECTED reducer', () => {

  test('should set conseilSelectedNode property', () => {
    const expectedState = initState.set('conseilSelectedNode', 'test');
    expect(nodes(undefined, actions.setSelected('test', 'CONSEIL'))).toEqualImmutable(expectedState);
  });

  test('should set tezosSelectedNode property', () => {
    const expectedState = initState.set('tezosSelectedNode', 'test');
    expect(nodes(undefined, actions.setSelected('test', 'test'))).toEqualImmutable(expectedState);
  });
});

describe('nodes ADD_NODE reducer', () => {

  test('should return state with new node', () => {
    const expectedState = initState.update('list', list => list.push('testNode'))
    expect(nodes(undefined, actions.addNode('testNode'))).toEqualImmutable(expectedState);
  });

});

describe('nodes REMOVE_NODE reducer', () => {

  test('should remove Cryptonomic-Nautilus node', () => {
    const expectedState = initState.update('list', list =>  
    list.filter(item =>  item.get('name') !== 'Cryptonomic-Nautilus'
  ))
    expect(nodes(undefined, actions.removeNode('Cryptonomic-Nautilus'))).toEqualImmutable(expectedState);
  });

});

describe('nodes UPDATE_NODE reducer', () => {

  test('should update last node', () => {
    const expectedState = initState.update('list',  list => list.set(-1, 'testNode'))
    expect(nodes(undefined, actions.updateNode('testNode'))).toEqualImmutable(expectedState);
  });

});

