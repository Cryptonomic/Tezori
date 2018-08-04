import * as status from '../constants/StatusTypes';
import { getSyncTransactions, syncTransactionsWithState } from './transaction';
import { activateAndUpdateAccount, getSelectedKeyStore, getSelectedHash } from './general';
import { createAccount, getAccountsForIdentity, getSyncAccount, syncAccountWithState } from './account';
import { TRANSACTIONS } from '../constants/TabConstants';
import { FUNDRAISER } from '../constants/storeTypes';

export function createIdentity(identity) {

  return {
    balance: 0,
    accounts: [],
    publicKeyHash: '', 
    publicKey: '',
    privateKey: '',
    operations: {},
    order: null,
    storeType: FUNDRAISER,
    activeTab: TRANSACTIONS,
    status: status.CREATED,
    transactions: [],
    ...identity
  };
}

export function findIdentity(identities, publicKeyHash) {
  return (identities || []).find( identity => identity.publicKeyHash === publicKeyHash );
}

export function findIdentityIndex(identities, publicKeyHash) {
  return (identities || []).findIndex( identity => identity.publicKeyHash === publicKeyHash );
}

export async function getSyncIdentity(identities, identity, nodes) {
  const { publicKeyHash } = identity;
  const keyStore = getSelectedKeyStore( identities, publicKeyHash, publicKeyHash );
  identity = await activateAndUpdateAccount(identity, keyStore, nodes);
  const { selectedAccountHash } = getSelectedHash();
  /*
   *  we are taking state identity accounts overriding their state
   *  with the new account we got from setAccounts.. check if any of any new accounts
   *  were create and are state identity but dont come back from getAccount and contact
   *  those accounts with the updated accounts we got from getAccounts.
   * */

  let accounts =  await getAccountsForIdentity( nodes, publicKeyHash )
    .catch( (error) => {
      console.log('-debug: Error in: status.getAccountsForIdentity for:' + publicKeyHash);
      console.error(error);
      return [];
    });

  const stateAccountIndices = identity.accounts
    .map( account =>
      account.accountId
    );

  accounts = accounts.map(account => {
    const foundIndex = stateAccountIndices.indexOf(account.accountId);
    const overrides = {};
    if ( foundIndex > -1 ) {
      overrides.status = identity.accounts[foundIndex].status;
      overrides.operations = identity.accounts[foundIndex].operations;
      overrides.activeTab = identity.accounts[foundIndex].activeTab;
      overrides.order = identity.accounts[foundIndex].order;
      overrides.transactions = identity.accounts[foundIndex].transactions;
    }
    return createAccount({
        ...account,
        ...overrides
      },
      identity
    );
  });

  const accountIndices = accounts
    .map( account =>
      account.accountId
    );

  const accountsToConcat = identity.accounts.filter((account) => {
    return accountIndices.indexOf(account.accountId) === -1;
  });

  accounts = accounts.concat(accountsToConcat);
  
  //  Adding order to accounts without it - in-case of import.
  identity.accounts = accounts.map((account, accountIndex) => {
    account.order = account.order || (accountIndex + 1);
    return account;
  });
  identity.accounts = await Promise.all(
    ( identity.accounts || []).map(async account => {
      if ( account.status !== status.READY ) {
        return await getSyncAccount(
          identities,
          account,
          nodes,
          account.accountId,
          publicKeyHash
        ).catch( e => {
          console.log('-debug: Error in: getSyncIdentity for:' + identity.publicKeyHash);
          console.error(e);
          return account;
        });

      } else if ( selectedAccountHash === account.accountId ) {
        account.transactions = await getSyncTransactions(selectedAccountHash, nodes, account.transactions);
      }
      return account;
    })
  );
  
  if ( publicKeyHash === selectedAccountHash ) {
    identity.transactions = await getSyncTransactions(publicKeyHash, nodes, identity.transactions);
  }

  return identity;
}

export function syncIdentityWithState(syncIdentity, stateIdentity) {
  const newAccounts = stateIdentity.accounts
    .filter(stateIdentityAccount => {
      const syncIdentityAccountIndex = syncIdentity.accounts
        .findIndex(syncIdentityAccount =>
          syncIdentityAccount.accountId === stateIdentityAccount.accountId
        );

      if ( syncIdentityAccountIndex > -1 ) {
        syncIdentity.accounts[syncIdentityAccountIndex] = syncAccountWithState(
          syncIdentity.accounts[syncIdentityAccountIndex],
          stateIdentityAccount
        );
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