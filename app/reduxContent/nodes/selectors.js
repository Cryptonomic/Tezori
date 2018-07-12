import { createSelector } from 'reselect';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';

export const getNodes = state => state.nodes;

export const getConseilSelectedNode = createSelector(getNodes, nodes =>
  nodes.get('conseilSelectedNode')
);

export const getTezosSelectedNode = createSelector(getNodes, nodes =>
  nodes.get('tezosSelectedNode')
);

export const getNodesList = createSelector(getNodes, nodes =>
  nodes.get('list')
);

export const getTezosNodes = createSelector(getNodesList, nodesList =>
  nodesList.filter(node => node.get('type') === TEZOS)
);

export const getConseilNodes = createSelector(getNodesList, nodesList =>
  nodesList.filter(node => node.get('type') === CONSEIL)
);
