import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';

const fileName = 'defaultWalletNodes.json';
let filePath = path.join(__dirname, '../extraResources/', fileName);
if (process.env.NODE_ENV === 'production') {
  filePath = path.join(remote.app.getAppPath(), '../extraResources/', fileName);
}

export function getWalletNodes() {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return false;
}

export function setWalletNodes(nodes) {
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, Buffer.from(JSON.stringify(nodes, null,  2)));
  }
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