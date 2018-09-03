import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

const fileName = 'walletSettings.json';
let filePath = path.join(__dirname, 'extraResources/', fileName);
if (process.env.NODE_ENV === 'production') {
  filePath = path.join(remote.app.getAppPath(), 'dist', 'extraResources/', fileName);
}

export function getWalletSettings() {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }
  return false;
}

export function setWalletSettings(nodes) {
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, Buffer.from(JSON.stringify(nodes, null,  2)));
  }
}