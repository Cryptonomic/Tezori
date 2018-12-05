import { createSelector } from 'reselect';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';

export const getSettings = state => state.settings;

export const getDelegateTooltip = createSelector(
  getSettings,
  settings => settings.get('delegateTooltip')
);

export const getConseilSelectedNode = createSelector(
  getSettings,
  settings => settings.get('conseilSelectedNode')
);

export const getTezosSelectedNode = createSelector(
  getSettings,
  settings => settings.get('tezosSelectedNode')
);

export const getLocale = createSelector(
  getSettings,
  settings => settings.get('locale')
);

export const getNodesList = createSelector(
  getSettings,
  settings => settings.get('nodesList')
);

export const getTezosNodes = createSelector(
  getNodesList,
  nodesList => nodesList.filter(node => node.get('type') === TEZOS)
);

export const getConseilNodes = createSelector(
  getNodesList,
  nodesList => nodesList.filter(node => node.get('type') === CONSEIL)
);

export const getSelectedPath = createSelector(
  getSettings,
  settings => settings.get('selectedPath')
);

export const getPathsList = createSelector(
  getSettings,
  settings => settings.get('pathsList')
);

export const getUsingPath = createSelector(
  getPathsList,
  getSelectedPath,
  (pathsList, selectedPath) => {
    let path = '';
    const foundPath = pathsList.find(path => {
      const label = path.get('label');
      return label === selectedPath;
    });
    if (foundPath) {
      path = foundPath.get('derivation');
    }
    return path;
  }
);
