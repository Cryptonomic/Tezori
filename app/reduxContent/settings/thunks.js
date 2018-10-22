import { setWalletSettings } from '../../utils/settings';
import {
  setSelected as _setSelected,
  setLocale as _setLocale,
  addNode as _addNode,
  removeNode as _removeNode,
  updateNode as _updateNode,
  hideDelegateTooltip as _hideDelegateTooltip
} from './actions';

import { getSettings } from './selectors';

export function hideDelegateTooltip(boolean) {
  return (dispatch, state) => {
    dispatch(_hideDelegateTooltip(boolean));
    setWalletSettings(getSettings(state()).toJS())
  }
}

export function setSelected(name, target) {
  return (dispatch, state) => {
    dispatch(_setSelected(name, target));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function setLocale(locale) {
  return (dispatch, state) => {
    dispatch(_setLocale(locale));
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
