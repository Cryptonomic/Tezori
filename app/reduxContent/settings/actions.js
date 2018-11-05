import {
  SET_SELECTED,
  SET_LOCALE,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  CLEAR_STATE,
  HIDE_DELEGATE_TOOLTIP
} from './types';
import actionCreator from '../../utils/reduxHelpers';

export const hideDelegateTooltip = actionCreator(
  HIDE_DELEGATE_TOOLTIP,
  'target'
);
export const setSelected = actionCreator(SET_SELECTED, 'selected', 'target');
export const setLocale = actionCreator(SET_LOCALE, 'locale');
export const addNode = actionCreator(ADD_NODE, 'node');
export const removeNode = actionCreator(REMOVE_NODE, 'name');
export const updateNode = actionCreator(UPDATE_NODE, 'node');
export const clearState = actionCreator(CLEAR_STATE);
