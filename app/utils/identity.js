import { StoreType } from 'conseiljs';
import * as status from '../constants/StatusTypes';
import { getSyncTransactions, syncTransactionsWithState } from './transaction';
import {
  activateAndUpdateAccount,
  getSelectedKeyStore,
  getSelectedHash
} from './general';
import {
  createAccount,
  getAccountsForIdentity,
  getSyncAccount,
  syncAccountWithState
} from './account';
import { TRANSACTIONS } from '../constants/TabConstants';

const { Fundraiser } = StoreType;

export function createIdentity(identity) {
  return {
    balance: 0,
    accounts: [],
    publicKeyHash: '',
    publicKey: '',
    privateKey: '',
    operations: {},
    order: null,
    storeType: Fundraiser,
    activeTab: TRANSACTIONS,
    status: status.CREATED,
    transactions: [],
    delegate: '',
    ...identity
  };
}

export function findIdentity(identities, publicKeyHash) {
  return (identities || []).find(
    identity => identity.publicKeyHash === publicKeyHash
  );
}

export function findIdentityIndex(identities, publicKeyHash) {
  return (identities || []).findIndex(
    identity => identity.publicKeyHash === publicKeyHash
  );
}

export async function getSyncIdentity(
  identities,
  identity,
  nodes,
  isLedger = false,
  network,
  platform
) {
  const { publicKeyHash } = identity;
  const keyStore = getSelectedKeyStore(
    identities,
    publicKeyHash,
    publicKeyHash
  );
  identity = await activateAndUpdateAccount(
    identity,
    keyStore,
    nodes,
    isLedger,
    network
  );

  const { selectedAccountHash } = getSelectedHash();
  /*
   *  we are taking state identity accounts overriding their state
   *  with the new account we got from setAccounts.. check if any of any new accounts
   *  were create and are state identity but dont come back from getAccount and contact
   *  those accounts with the updated accounts we got from getAccounts.
   * */

  let accounts = await getAccountsForIdentity(nodes, publicKeyHash, network, platform).catch(
    error => {
      console.log(
        '-debug: Error in: status.getAccountsForIdentity for:' + publicKeyHash
      );
      console.error(error);
      return [];
    }
  );

  const stateAccountIndices = identity.accounts.map(
    account => account.account_id
  );

  accounts = accounts.map(account => {
    const foundIndex = stateAccountIndices.indexOf(account.account_id);
    const overrides = {};
    if (foundIndex > -1) {
      overrides.status = identity.accounts[foundIndex].status;
      overrides.operations = identity.accounts[foundIndex].operations;
      overrides.activeTab = identity.accounts[foundIndex].activeTab;
      overrides.order = identity.accounts[foundIndex].order;
      overrides.transactions = identity.accounts[foundIndex].transactions;
    }
    return createAccount(
      {
        ...account,
        ...overrides
      },
      identity
    );
  });

  const accountIndices = accounts.map(account => account.account_id);

  const accountsToConcat = identity.accounts.filter(account => {
    return accountIndices.indexOf(account.account_id) === -1;
  });

  accounts = accounts.concat(accountsToConcat);

  //  Adding order to accounts without it - in-case of import.
  identity.accounts = accounts.map((account, accountIndex) => {
    account.order = account.order || accountIndex + 1;
    return account;
  });
  identity.accounts = await Promise.all(
    (identity.accounts || []).map(async account => {
      if (account.status !== status.READY) {
        return await getSyncAccount(
          identities,
          account,
          nodes,
          account.account_id,
          publicKeyHash,
          isLedger,
          network
        ).catch(e => {
          console.log(
            '-debug: Error in: getSyncIdentity for:' + identity.publicKeyHash
          );
          console.error(e);
          return account;
        });
      } else if (selectedAccountHash === account.account_id) {
        account.transactions = await getSyncTransactions(
          selectedAccountHash,
          nodes,
          account.transactions,
          network
        );
      }
      return account;
    })
  );

  if (publicKeyHash === selectedAccountHash) {
    identity.transactions = await getSyncTransactions(
      publicKeyHash,
      nodes,
      identity.transactions,
      network
    );
  }

  return identity;
}

export function syncIdentityWithState(syncIdentity, stateIdentity) {
  const newAccounts = stateIdentity.accounts.filter(stateIdentityAccount => {
    const syncIdentityAccountIndex = syncIdentity.accounts.findIndex(syncIdentityAccount => syncIdentityAccount.account_id === stateIdentityAccount.account_id);

    if (syncIdentityAccountIndex > -1) {
      syncIdentity.accounts[syncIdentityAccountIndex] = syncAccountWithState(syncIdentity.accounts[syncIdentityAccountIndex], stateIdentityAccount);
      return false;
    }

    return true;
  });

  syncIdentity.activeTab = stateIdentity.activeTab;
  syncIdentity.accounts = syncIdentity.accounts.concat(newAccounts);
  syncIdentity.transactions = syncTransactionsWithState(
    syncIdentity.transactions,
    stateIdentity.transactions
  );

  return syncIdentity;
}
