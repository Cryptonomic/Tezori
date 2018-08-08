import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SELECTED,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  CLEAR_STATE
} from './types';
import { CONSEIL } from '../../constants/NodesTypes';
import { getWalletNodes } from '../../utils/nodes';

const defaultWalletNodes = getWalletNodes();

const baseDefaults = {
  tezosSelectedNode: '',
  conseilSelectedNode: '',
  list: []
};

export const initialState = Object.assign(
  baseDefaults,
  defaultWalletNodes && defaultWalletNodes
);

export default handleActions({
  [ SET_SELECTED ]: (state, action) => {
    return action.target === CONSEIL
      ? state.set('conseilSelectedNode', action.selected)
      : state.set('tezosSelectedNode', action.selected);
  },
  [ ADD_NODE ]: (state, action) => {
    const newNode = action.node;
    const list = state.get('list');
    const indexFound = list.findIndex(item => {
      return item.get('name') === newNode.name;
    });

    if (indexFound === -1) {
      return state.set('list', list.push(fromJS(newNode)));
    }
    return state;
  },
  [ REMOVE_NODE ]: (state, action) => {
    const { name } = action;
    const list = state.get('list');
    const indexFound = list.findIndex(item => {
      return item.get('name') === name;
    });

    if (indexFound >= -1) {
      return state.set('list', list.splice(indexFound, 1));
    }
    return state;
  },
  [ UPDATE_NODE ]: (state, action) => {
    const newNode = action.node;
    const list = state.get('list');
    const indexFound = list.findIndex(item => {
      return item.get('name') === newNode.name;
    });

    if (indexFound >= -1) {
      return state.set('list', list.set(indexFound, fromJS(newNode)));
    }
    return state;
  },
  [ CLEAR_STATE ]: () => {
    return fromJS(initialState);
  }
}, fromJS(initialState));
