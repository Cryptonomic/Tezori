import {
  SET_SELECTED,
  ADD_NODE,
  REMOVE_NODE,
  UPDATE_NODE,
  CLEAR_STATE
} from './types';
import actionCreator from '../../utils/reduxHelpers';
export const setSelected = actionCreator(SET_SELECTED, 'selected', 'target');
export const addNode = actionCreator(ADD_NODE, 'node');
export const removeNode = actionCreator(REMOVE_NODE, 'name');
export const updateNode = actionCreator(UPDATE_NODE, 'node');
export const clearState = actionCreator(CLEAR_STATE);
