import { ConseilMetadataClient } from 'conseiljs';
import { setWalletSettings } from '../../utils/settings';
import { getSelectedNode } from '../../utils/nodes';
import {
  setSelected as _setSelected,
  setLocale as _setLocale,
  setPath as _setPath,
  addNode as _addNode,
  removeNode as _removeNode,
  updateNode as _updateNode,
  addPath as _addPath,
  removePath as _removePath,
  updatePath as _updatePath,
  hideDelegateTooltip as _hideDelegateTooltip,
  setNetwork as _setNetwork
} from './actions';

import { getSettings } from './selectors';
import { CONSEIL } from '../../constants/NodesTypes';

export function hideDelegateTooltip(boolean) {
  return (dispatch, state) => {
    dispatch(_hideDelegateTooltip(boolean));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function setSelected(name, target) {
  return async (dispatch, state) => {
    dispatch(_setSelected(name, target));
    if (target === CONSEIL) {
      await fetchNetwork();
    } else {
      setWalletSettings(getSettings(state()).toJS());
    }
  };
}

export function setLocale(locale) {
  return (dispatch, state) => {
    dispatch(_setLocale(locale));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function setPath(selected) {
  return (dispatch, state) => {
    dispatch(_setPath(selected));
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

export function addPath(path) {
  return (dispatch, state) => {
    dispatch(_addPath(path));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function removePath(label) {
  return (dispatch, state) => {
    dispatch(_removePath(label));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function updatePath(path) {
  return (dispatch, state) => {
    dispatch(_updatePath(path));
    setWalletSettings(getSettings(state()).toJS());
  };
}

export function fetchNetwork() {
  return async (dispatch, state) => {
    const settings = state().settings.toJS();
    const conseilNode = getSelectedNode(settings, CONSEIL);
    const serverInfo = {
      url: conseilNode.url,
      apiKey: conseilNode.apiKey
    };

    const platforms = await ConseilMetadataClient.getPlatforms(serverInfo);
    const networks = await ConseilMetadataClient.getNetworks(
      serverInfo,
      platforms[0].name
    );
    dispatch(_setNetwork(networks[0].network));
    setWalletSettings(getSettings(state()).toJS());
  };
}
