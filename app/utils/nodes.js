import path from 'path';
import fs from 'fs';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
const filename = path.join(__dirname, 'savedWalletNode.json');

export function setWalletNodes(nodes) {
  fs.writeFileSync(filename, Buffer.from(JSON.stringify(nodes, null,  2)));
}

export function getWalletNodes() {
  let nodes = null;
  if (fs.existsSync(filename)) {
    try {
      nodes = JSON.parse(fs.readFileSync(filename).toString());
    } catch(e) {
      console.error(e)
    }

  }
  return nodes;
}

export function getSelectedNode(nodes, type) {
  const selected =  type === CONSEIL
    ? nodes.conseilSelectedNode
    : nodes.tezosSelectedNode;
  return nodes.list.find( node => node.type === type && node.name === selected );
}

export function hasNodes(state) {
  const list = state.nodes.get('list').toJS();
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