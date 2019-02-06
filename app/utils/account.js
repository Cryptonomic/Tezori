import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { TRANSACTIONS } from '../constants/TabConstants';
import { getSyncTransactions, syncTransactionsWithState } from './transaction';
import {
  activateAndUpdateAccount,
  getSelectedKeyStore,
  getSelectedHash
} from './general';
import { getSelectedNode } from './nodes';
import { ConseilQuery, ConseilQueryBuilder, ConseilOperator, ConseilPredicate, ConseilOrdering, ConseilSortDirection, TezosConseilClient, TezosNode, TezosOperations } from 'conseiljs';

export function createAccount(account, identity) {
  return {
    accountId: '',
    balance: 0,
    blockId: '',
    counter: 0,
    delegateSetable: false,
    delegateValue: null,
    manager: '',
    script: null,
    spendable: true,
    transactions: [],
    activeTab: TRANSACTIONS,
    status: status.CREATED,
    operations: {},
    order: null,
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    ...account
  };
}

export function findAccount(identity, accountId) {
  return (
    identity &&
    (identity.accounts || []).find(account => account.accountId === accountId)
  );
}

export function findAccountIndex(identity, accountId) {
  return (
    identity &&
    (identity.accounts || []).findIndex(
      account => account.accountId === accountId
    )
  );
}

export function createSelectedAccount({ balance = 0, transactions = [] } = {}) {
  return { balance, transactions };
}

export async function getAccountsForIdentity(nodes, id) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);

  let accountsquery = ConseilQueryBuilder.blankQuery();
  accountsquery = ConseilQueryBuilder.addPredicate(accountsquery, 'manager', ConseilOperator.EQ, [id], false);
  accountsquery = ConseilQueryBuilder.setLimit(accountsquery, 300);
  const accounts = await TezosConseilClient.getAccounts({url: url, apiKey: apiKey}, 'alphanet', accountsquery);

  return accounts.filter(account => account.accountId !== id);
}

export async function getSyncAccount(
  identities,
  account,
  nodes,
  accountHash,
  parentHash,
  isLedger = false
) {
  const keyStore = getSelectedKeyStore(identities, accountHash, parentHash);
  account = await activateAndUpdateAccount(
    account,
    keyStore,
    nodes,
    isLedger
  ).catch(e => {
    console.log('-debug: Error in: getSyncAccount for:' + accountHash);
    console.error(e);
    return account;
  });

  const { selectedAccountHash } = getSelectedHash();
  if (accountHash === selectedAccountHash) {
    account.transactions = await getSyncTransactions(
      accountHash,
      nodes,
      account.transactions
    );
  }
  return account;
}

export function syncAccountWithState(syncAccount, stateAccount) {
  syncAccount.activeTab = stateAccount.activeTab;
  syncAccount.transactions = syncTransactionsWithState(
    syncAccount.transactions,
    stateAccount.transactions
  );

  return syncAccount;
}
