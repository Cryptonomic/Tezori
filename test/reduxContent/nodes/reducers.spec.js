import { fromJS } from 'immutable';
import { omit } from 'lodash';

import nodes from '../../../app/reduxContent/nodes/reducers';
import * as actions from '../../../app/reduxContent/nodes/actions';
import * as defaultWalletNodes from '../../../app/defaultWalletNodes.json';

const baseDefaults = {
  tezosSelectedNode: '',
  conseilSelectedNode: '',
  list: []
};

const initState = fromJS(Object.assign(
  baseDefaults,
  defaultWalletNodes && omit(defaultWalletNodes, ['default'])
));

const expectedState = {
  CLEAR_STATE: initState,
  SET_SELECTED_CONSEIL_TRUE: initState.set('conseilSelectedNode', 'test'),
  SET_SELECTED_CONSEIL_FALSE: initState.set('tezosSelectedNode', 'test')
}

describe('action type CLEAR_STATE', () => {
  test('returns the correct state', () => {
    expect(nodes(undefined, actions.clearState())).toEqual(expectedState['CLEAR_STATE']);
  });
});

describe('action type SET_SELECTED with target equal CONSEIL', () => {
  test('returns the correct state', () => {
    expect(nodes(undefined, actions.setSelected('test', 'CONSEIL'))).toEqual(expectedState['SET_SELECTED_CONSEIL_TRUE']);
  });
});

describe('action type SET_SELECTED with target not equal CONSEIL', () => {
  test('returns the correct state', () => {
    expect(nodes(undefined, actions.setSelected('test', 'test'))).toEqual(expectedState['SET_SELECTED_CONSEIL_FALSE']);
  });
});

