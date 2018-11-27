import path from 'path';
import fs from 'fs';
import { remote } from 'electron';
import { omit, pick } from 'lodash';
import { TezosWallet, TezosHardwareWallet } from 'conseiljs';
import { keys } from '@material-ui/core/styles/createBreakpoints';
import { LEDGER } from '../constants/StoreTypes';
const { saveWallet, loadWallet } = TezosWallet;


const fileName = 'walletState';
let walletStatePath = path.join(__dirname, 'extraResources/', fileName);
if (process.env.NODE_ENV === 'production') {
  walletStatePath = path.join(remote.app.getAppPath(), 'dist', 'extraResources/', fileName);
}

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
  fs.writeFileSync(
    walletStatePath,
    Buffer.from(JSON.stringify(prepareToPersist(walletState)), 'binary')
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
      name: "components.messageBar.messages.invalid_wallet_password",
      ...err
    };
    console.error(errorObj);
    throw errorObj;
  });

  let persistedState = null;
  if (fs.existsSync(walletStatePath)) {
    try {
      persistedState = JSON.parse(fs.readFileSync(walletStatePath).toString('binary'));
    } catch(e) {
      console.error(e);
    }
  }

  return prepareToLoad(savedWallet, persistedState);
}

export async function loadWalletFromLedger(derivationPath) {
  const identity = await TezosHardwareWallet.unlockAddress(0, derivationPath).catch(err => {
    const errorObj = {
      name: "components.messageBar.messages.ledger_not_connect"
    };
    console.error(errorObj);
    throw errorObj;
  });
  identity.storeType = LEDGER;
  let ledgerWallet = {"identities": []};
  ledgerWallet.identities.push(identity);

  let persistedState = null;
  if (fs.existsSync(walletStatePath)) {
    try {
      persistedState = JSON.parse(fs.readFileSync(walletStatePath).toString('binary'));
    } catch(e) {
      console.error(e);
    }
  }

  return prepareToLoad(ledgerWallet, persistedState);
}

export function initLedgerTransport() {
  TezosHardwareWallet.initLedgerTransport();
}
