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
  HIDE_DELEGATE_TOOLTIP,
  SET_NETWORK
} from './types';
import actionCreator from '../../utils/reduxHelpers';

export const hideDelegateTooltip = actionCreator(
  HIDE_DELEGATE_TOOLTIP,
  'target'
);
export const setSelected = actionCreator(SET_SELECTED, 'selected', 'target');
export const setLocale = actionCreator(SET_LOCALE, 'locale');
export const setPath = actionCreator(SET_PATH, 'selected');
export const addNode = actionCreator(ADD_NODE, 'node');
export const removeNode = actionCreator(REMOVE_NODE, 'name');
export const updateNode = actionCreator(UPDATE_NODE, 'node');
export const addPath = actionCreator(ADD_PATH, 'path');
export const removePath = actionCreator(REMOVE_PATH, 'label');
export const updatePath = actionCreator(UPDATE_PATH, 'path');
export const clearState = actionCreator(CLEAR_STATE);
export const setNetwork = actionCreator(SET_NETWORK, 'network');
