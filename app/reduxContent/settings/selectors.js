import { createSelector } from 'reselect';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';

export const getSettings = state => state.settings;

export const getDelegateTooltip = createSelector(getSettings, settings =>
  settings.get('delegateTooltip')
);

export const getConseilSelectedNode = createSelector(getSettings, settings =>
  settings.get('conseilSelectedNode')
);

export const getTezosSelectedNode = createSelector(getSettings, settings =>
  settings.get('tezosSelectedNode')
);

export const getLocale = createSelector(getSettings, settings =>
  settings.get('locale')
);

export const getNodesList = createSelector(getSettings, settings =>
  settings.get('nodesList')
);

export const getTezosNodes = createSelector(getNodesList, nodesList =>
  nodesList.filter(node => node.get('type') === TEZOS)
);

export const getConseilNodes = createSelector(getNodesList, nodesList =>
  nodesList.filter(node => node.get('type') === CONSEIL)
);
