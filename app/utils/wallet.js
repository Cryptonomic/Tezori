import path from 'path';
import fs from 'fs';
import { omit } from 'lodash';
import { TezosWallet } from 'conseiljs';
const { saveWallet, loadWallet } = TezosWallet;
const walletStatePath = path.join(__dirname, 'walletState');

export async function saveUpdatedWallet(identities, walletLocation, walletFileName, password) {
  const completeWalletPath = path.join(walletLocation, walletFileName);

  identities = identities
    .map(({ publicKey, privateKey, publicKeyHash, storeTypes }) => {
      return { publicKey, privateKey, publicKeyHash, storeTypes };
    });

  return await saveWallet( completeWalletPath, { identities }, password );
}

function prepareToPersist(walletState) {
  walletState.identities = walletState.identities
    .map((identity) => {
      identity = omit(identity, [ 'publicKey', 'privateKey' ]);
      identity.accounts = identity.accounts.map((account) => {
        account = omit(account, [ 'publicKey', 'privateKey' ]);
        account.transactions = account.transactions
          .map((transaction) =>
            omit(transaction, [ 'publicKey', 'privateKey' ])
          );

        return account;
      });

      identity.transactions = identity.transactions
        .map((transaction) =>
          omit(transaction, [ 'publicKey', 'privateKey' ])
        );

      return identity;
    });

  return walletState;
}

export function persistWalletState(walletState) {
  if (fs.existsSync(walletStatePath)) {
    fs.unlinkSync(walletStatePath);
  }

  fs.writeFileSync(
    walletStatePath,
    Buffer.from(JSON.stringify(prepareToPersist(walletState)), 'binary')
  );
}


function prepareToLoad(savedWallet, persistedState) {

}

export async function loadPersistedState(walletPath, password) {
  const savedWallet = await loadWallet(walletPath, password).catch(err => {
    const errorObj = {
      name: 'Invalid wallet/password combination.',
      ...err
    };
    throw errorObj;
  });

  let persistedState = null;
  if (fs.existsSync(walletStatePath)) {
    persistedState = JSON.parse(fs.readFileSync(walletStatePath).toString('binary'));
  }

  return prepareToLoad(savedWallet, persistedState);
}
