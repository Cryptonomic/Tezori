import { setWalletSettings } from '../../utils/settings';
import {
  setSelected as _setSelected,
  setLocal as _setLocal,
  addNode as _addNode,
  removeNode as _removeNode,
  updateNode as _updateNode
} from './actions';

import { getSettings } from './selectors';

export function setSelected(name, target) {
  return (dispatch, state) => {
    dispatch(_setSelected(name, target));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function setLocal(local) {
  return (dispatch, state) => {
    dispatch(_setLocal(local));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function addNode(node) {
  return (dispatch, state) => {
    dispatch(_addNode(node));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function removeNode(name) {
  return (dispatch, state) => {
    dispatch(_removeNode(name));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function updateNode(node) {
  return (dispatch, state) => {
    dispatch(_updateNode(node));
    setWalletSettings(getSettings(state()).toJS());
  };
}
