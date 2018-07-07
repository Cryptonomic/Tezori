import { omit } from 'lodash';
import {
  SET_SELECTED,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  CLEAR_STATE
} from './types';
import { fromJS } from 'immutable';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';
import * as defaultWalletNodes from '../../defaultWalletNodes.json';

const baseDefaults = {
  tezosSelectedNode: '',
  conseilSelectedNode: '',
  list: []
};

const initState = fromJS(Object.assign(
  baseDefaults,
  defaultWalletNodes && omit(defaultWalletNodes, ['default'])
));

export default function nodes(state = initState, action) {
  switch (action.type) {
    case SET_SELECTED: {
      return action.target === CONSEIL
        ? state.set('conseilSelectedNode', action.selected)
        : state.set('tezosSelectedNode',  action.selected);
    }
    case ADD_NODE: {
      const newNode = action.node;
      const list = state.get('list');
      const indexFound = list.findIndex((item) => {
        return item.get('name') === newNode.name;
      });

      if (indexFound === -1) {
        return state.set('list', list.push(fromJS(newNode)));
      }
      return state;
    }
    case REMOVE_NODE: {
      const name = action.name;
      const list = state.get('list');
      const indexFound = list.findIndex((item) => {
        return item.get('name') === name;
      });

      if (indexFound >= -1) {
        return state.set('list', list.splice(indexFound, 1));
      }
      return state;
    }
    case UPDATE_NODE: {
      const newNode = action.node;
      const list = state.get('list');
      const indexFound = list.findIndex((item) => {
        return item.get('name') === newNode.name;
      });

      if (indexFound >= -1) {
        return state.set('list', list.set(indexFound, fromJS(newNode)));
      }
      return state;
    }
    case CLEAR_STATE: {
      return initState;
    }
    default:
      return state;
  }
}