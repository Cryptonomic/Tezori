import path from 'path';
import { TezosWallet } from 'conseiljs';
const { saveWallet } = TezosWallet;
export async function saveUpdatedWallet(identities, walletLocation, walletFileName, password) {
  const completeWalletPath = path.join(walletLocation, walletFileName);

  identities = identities
    .map(({ publicKey, privateKey, publicKeyHash, storeTypes }) => {
      return { publicKey, privateKey, publicKeyHash, storeTypes };
    });

  return await saveWallet( completeWalletPath, { identities }, password );
}