import { setWalletNodes } from '../../utils/nodes';
import {
  setSelected as _setSelected,
  addNode as _addNode,
  removeNode as _removeNode,
  updateNode as _updateNode,
} from './actions';

import {
  getNodes
} from './selectors';

export function setSelected(name, target) {
  return (dispatch, state) => {
    dispatch(_setSelected(name, target));
    console.log('setSelected', getNodes(state()).toJS());
    setWalletNodes(getNodes(state()).toJS());
  };
}

export function addNode(node) {
  return (dispatch, state) => {
    dispatch(_addNode(node));
    console.log('addNode', getNodes(state()).toJS());
    setWalletNodes(getNodes(state()).toJS());
  };
}

export function removeNode(name) {
  return (dispatch, state) => {
    dispatch(_removeNode(name));
    setWalletNodes(getNodes(state()).toJS());
  };
}

export function updateNode(node) {
  return (dispatch, state) => {
    dispatch(_updateNode(node));
    setWalletNodes(getNodes(state()).toJS());
  };
}