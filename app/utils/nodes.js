import { TEZOS, CONSEIL } from '../constants/NodesTypes';

export function getSelectedNode(settings, type) {
  const selected = type === CONSEIL
    ? settings.conseilSelectedNode
    : settings.tezosSelectedNode;
  return settings.nodesList.find( node => node.type === type && node.name === selected );
}

export function hasNodes(state) {
  const list = state.settings.get('nodesList').toJS();
  let i = 0;
  const l = list.length;
  let hasConseil = false;
  let hasTezos = false;
  for ( i; i < l; i++) {
    const node = list[i];
    const type = node.type;

    if ( type === CONSEIL ) {
      hasConseil = true;
    }

    if ( type === TEZOS ) {
      hasTezos = true;
    }

    if ( hasConseil && hasTezos ) {
      return true;
    }
  }
  return false;
}