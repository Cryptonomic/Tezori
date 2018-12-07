import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SET_SELECTED,
  SET_LOCALE,
  SET_PATH,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  ADD_PATH,
  REMOVE_PATH,
  UPDATE_PATH,
  CLEAR_STATE,
  HIDE_DELEGATE_TOOLTIP
} from './types';
import { CONSEIL } from '../../constants/NodesTypes';
import {
  getWalletSettings,
  getWalletSettingsFromStorage
} from '../../utils/settings';
import { getDefaultLocale } from '../../utils/i18n';

let walletSettings = getWalletSettings();
const walletSettings1 = getWalletSettingsFromStorage();
if (walletSettings1) {
  walletSettings = JSON.parse(walletSettings1);
}

const baseDefaults = {
  locale: getDefaultLocale(), // get electron locale here
  tezosSelectedNode: '',
  conseilSelectedNode: '',
  nodesList: [],
  delegateTooltip: false,
  selectedPath: '',
  pathsList: []
};

export const initialState = Object.assign(
  baseDefaults,
  walletSettings && walletSettings
);

export default handleActions(
  {
    [HIDE_DELEGATE_TOOLTIP]: (state, action) => {
      return action.target === 'true'
        ? state.set('delegateTooltip', true)
        : state.set('delegateTooltip', false);
    },
    [SET_SELECTED]: (state, action) => {
      return action.target === CONSEIL
        ? state.set('conseilSelectedNode', action.selected)
        : state.set('tezosSelectedNode', action.selected);
    },
    [SET_LOCALE]: (state, action) => {
      return state.set('locale', action.locale);
    },
    [SET_PATH]: (state, action) => {
      return state.set('selectedPath', action.selected);
    },
    [ADD_NODE]: (state, action) => {
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
    [REMOVE_NODE]: (state, action) => {
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
    [UPDATE_NODE]: (state, action) => {
      const newNode = action.node;
      const nodesList = state.get('nodesList');
      const indexFound = nodesList.findIndex(item => {
        return item.get('name') === newNode.name;
      });

      if (indexFound >= -1) {
        return state.set(
          'nodesList',
          nodesList.set(indexFound, fromJS(newNode))
        );
      }
      return state;
    },
    [ADD_PATH]: (state, action) => {
      const newPath = action.path;
      const pathsList = state.get('pathsList');

      const indexFound = pathsList.findIndex(
        item => item.get('label') === newPath.label
      );

      if (indexFound === -1) {
        return state.set('pathsList', pathsList.push(fromJS(newPath)));
      }

      return state;
    },
    [REMOVE_PATH]: (state, action) => {
      const { label } = action;
      const pathsList = state.get('pathsList');
      const indexFound = pathsList.findIndex(item => {
        return item.get('label') === label;
      });

      if (indexFound > -1) {
        return state.set('pathsList', pathsList.splice(indexFound, 1));
      }
      return state;
    },
    [UPDATE_PATH]: (state, action) => {
      const newPath = action.path;
      const pathsList = state.get('pathsList');
      const indexFound = pathsList.findIndex(
        item => item.get('label') === newPath.label
      );

      if (indexFound > -1) {
        return state.set(
          'pathsList',
          pathsList.set(indexFound, fromJS(newPath))
        );
      }
      return state;
    },
    [CLEAR_STATE]: () => {
      return fromJS(initialState);
    }
  },
  fromJS(initialState)
);
