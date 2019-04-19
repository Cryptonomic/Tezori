import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

const fileName = 'walletSettings.json';
let filePath = path.join(__dirname, 'extraResources/', fileName);
if (process.env.NODE_ENV === 'production') {
  filePath = path.join(remote.app.getAppPath(), 'dist', 'extraResources/', fileName);
}

export function getWalletSettings() {
  const stringSettings = localStorage.getItem('settings');
  let localSettings = {};
  let fileSettings = {};
  if (stringSettings) {
    localSettings = JSON.parse(stringSettings);
  }
  if (fs.existsSync(filePath)) {
    fileSettings = JSON.parse(fs.readFileSync(filePath));
  }
  return {...localSettings, ...fileSettings};
}

export function setWalletSettings(nodes) {
  localStorage.setItem('settings', JSON.stringify(nodes));
}

export const getNodeUrl = (nodes, selectedNode) => {
  let url = '';
  const findedNode = nodes.find(node => {
    const name = node.get('name');
    return name === selectedNode;
  });
  if (findedNode) {
    url = findedNode.get('url');
  }
  return url;
};
