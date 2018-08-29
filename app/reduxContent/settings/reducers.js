import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SELECTED,
  SET_LOCAL,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  CLEAR_STATE
} from './types';
import { CONSEIL } from '../../constants/NodesTypes';
import { getWalletSettings } from '../../utils/settings';
import { getDefaultLocal } from '../../utils/i18n';

const walletSettings = getWalletSettings();

const baseDefaults = {
  local: getDefaultLocal(),// get electron local here
  tezosSelectedNode: '',
  conseilSelectedNode: '',
  nodesList: []
};

export const initialState = Object.assign(
  baseDefaults,
  walletSettings && walletSettings
);

export default handleActions({
  [ SET_SELECTED ]: (state, action) => {
    return action.target === CONSEIL
      ? state.set('conseilSelectedNode', action.selected)
      : state.set('tezosSelectedNode', action.selected);
  },
  [ SET_LOCAL ]: (state, action) => {
    return state.set('local', action.local);
  },
  [ ADD_NODE ]: (state, action) => {
    const newNode = action.node;
    const nodesList = state.get('nodesList');
    const indexFound = nodesList.findIndex(item => {
      return item.get('name') === newNode.name;
    });

    if (indexFound === -1) {
      return state.set('nodesList', nodesList.push(fromJS(newNode)));
    }
    return state;
  },
  [ REMOVE_NODE ]: (state, action) => {
    const { name } = action;
    const nodesList = state.get('nodesList');
    const indexFound = nodesList.findIndex(item => {
      return item.get('name') === name;
    });

    if (indexFound >= -1) {
      return state.set('nodesList', nodesList.splice(indexFound, 1));
    }
    return state;
  },
  [ UPDATE_NODE ]: (state, action) => {
    const newNode = action.node;
    const nodesList = state.get('nodesList');
    const indexFound = nodesList.findIndex(item => {
      return item.get('name') === newNode.name;
    });

    if (indexFound >= -1) {
      return state.set('nodesList', nodesList.set(indexFound, fromJS(newNode)));
    }
    return state;
  },
  [ CLEAR_STATE ]: () => {
    return fromJS(initialState);
  }
}, fromJS(initialState));
