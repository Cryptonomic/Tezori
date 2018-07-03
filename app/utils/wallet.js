import path from 'path';
import { TezosWallet } from 'conseiljs';
const { saveWallet } = TezosWallet;
export async function saveUpdatedWallet(identities, walletLocation, walletFileName, password) {
  const completeWalletPath = path.join(walletLocation, walletFileName);

  const identities = identities
    .map(({ publicKey, privateKey, publicKeyHash }) => {
      return { publicKey, privateKey, publicKeyHash };
    });

  return await saveWallet( completeWalletPath, { identities }, password );
}