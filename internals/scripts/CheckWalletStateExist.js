import path from 'path';
import fs from 'fs';

/*
 * Hacky solution to solve permission issues with linux
 * */
const fileName = 'walletState';
const walletStatePath = path.join(__dirname, '../../app/extraResources/', fileName);
if (fs.existsSync(walletStatePath)) {
  fs.unlinkSync(walletStatePath);
}

fs.writeFileSync(
  walletStatePath,
  Buffer.from(JSON.stringify({}), 'binary')
);
fs.chmodSync(walletStatePath, 511);

const walletSettings = 'walletSettings.json';
const walletSettingsPath = path.join(__dirname, '../../app/extraResources/', walletSettings);
let walletSettingsContent = '';
if (fs.existsSync(walletSettingsPath)) {
  walletSettingsContent = fs.readFileSync(walletSettingsPath);
  fs.unlinkSync(walletSettingsPath);
}

fs.writeFileSync(
  walletSettingsPath,
  Buffer.from(walletSettingsContent)
);
fs.chmodSync(walletSettingsPath, 511);