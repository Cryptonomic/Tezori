import path from 'path';
import fs from 'fs';
import { omit, pick } from 'lodash';
import { TezosWallet } from 'conseiljs';
const { saveWallet, loadWallet } = TezosWallet;
const walletStatePath = path.join(__dirname, 'walletState.json');

export async function saveUpdatedWallet(identities, walletLocation, walletFileName, password) {
  const completeWalletPath = path.join(walletLocation, walletFileName);

  identities = identities
    .map(({ publicKey, privateKey, publicKeyHash, storeType }) => {
      return { publicKey, privateKey, publicKeyHash, storeType };
    });

  return await saveWallet( completeWalletPath, { identities }, password );
}

function prepareToPersist(walletState) {
  walletState.identities = walletState.identities
    .map((identity) => {
      identity = omit(identity, [ 'publicKey', 'privateKey', 'activeTab' ]);
      identity.accounts = identity.accounts
        .map((account) => {
          account = omit(account, [ 'publicKey', 'privateKey', 'activeTab' ]);
          return account;
        });

      return identity;
    });
  return pick(walletState, [ 'identities' ]);
}

export function persistWalletState(walletState) {
  if (fs.existsSync(walletStatePath)) {
    fs.unlinkSync(walletStatePath);
  }

  fs.writeFileSync(
    walletStatePath,
    Buffer.from(JSON.stringify(prepareToPersist(walletState), null,  2), 'binary')
  );
}


function prepareToLoad(savedWallet, persistedState = {}) {
  const newWalletState = { ...savedWallet, ...persistedState };
  newWalletState.identities =  savedWallet.identities
    .map(savedIdentity => {
      const foundIdentity = persistedState
        && persistedState.identities
        && persistedState.identities
        .find((persistedIdentity) => {
          return savedIdentity.publicKeyHash === persistedIdentity.publicKeyHash;
        });

      if ( foundIdentity ) {
        savedIdentity = {
          ...savedIdentity,
          ...foundIdentity
        };
      }

      if ( savedIdentity.accounts ) {
        savedIdentity.accounts = savedIdentity.accounts
          .map((account) => {
            return {
              ...account,
              ...pick(savedIdentity, [ 'publicKey', 'privateKey' ])
            }
          });
      }

      return savedIdentity;
    });
  return newWalletState;
}

export async function loadPersistedState(walletPath, password) {
  const savedWallet = await loadWallet(walletPath, password).catch(err => {
    const errorObj = {
      name: 'Invalid wallet/password combination.',
      ...err
    };
    console.error(errorObj);
    throw errorObj;
  });

  let persistedState = null;
  if (fs.existsSync(walletStatePath)) {
    persistedState = JSON.parse(fs.readFileSync(walletStatePath).toString('binary'));
  }

  return prepareToLoad(savedWallet, persistedState);
}
