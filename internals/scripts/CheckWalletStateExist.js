import path from 'path';
import fs from 'fs';

/*
 * Hacky solution to solve permission issues with linux
 * */
const fileName = 'walletState';
const walletStatePath = path.join(__dirname, '../../extraResources/', fileName);
if (fs.existsSync(walletStatePath)) {
  fs.unlinkSync(walletStatePath);
}

fs.writeFileSync(
  walletStatePath,
  Buffer.from(JSON.stringify({}), 'binary')
);
fs.chmodSync(walletStatePath, 511);
