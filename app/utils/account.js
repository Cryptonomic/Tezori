import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { TRANSACTIONS } from '../constants/TabConstants';
import { getTransactions, activateAndUpdateAccount, getSelectedKeyStore, getSelectedHash } from './general';
import { getSelectedNode } from './nodes';
const { getAccounts, getEmptyTezosFilter } = TezosConseilQuery;

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
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    ...account
  };
}

export function findAccount( identity, accountId ) {
  return identity && ( identity.accounts || [] )
      .find( account => account.accountId === accountId );
}

export function findAccountIndex( identity, accountId ) {
  return identity && ( identity.accounts || [] )
      .findIndex( account => account.accountId === accountId );
}

export function createSelectedAccount({ balance = 0, transactions = [] } = {}) {
  return { balance, transactions };
}

export async function getAccountsForIdentity(nodes, id) {
  const emptyFilter = getEmptyTezosFilter();
  const filter = {...emptyFilter, account_manager: [id]};
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);
  const accounts = await getAccounts(url, filter, apiKey);
  return accounts.filter(account => account.accountId !== id);
}

export async function getSyncAccount( identities, account, nodes, accountHash, parentHash ) {
  const keyStore = getSelectedKeyStore( identities, accountHash, parentHash );
  account =  await activateAndUpdateAccount( account, keyStore, nodes ).catch( e => {
    console.log('-debug: Error in: getSyncAccount for:' + accountHash);
    console.error(e);
    return account;
  });
  
  const { selectedAccountHash } = getSelectedHash();
  if ( accountHash === selectedAccountHash ) {
    account.transactions = await getTransactions(accountHash, nodes)
      .catch( e => {
        console.log('-debug: Error in: getSyncAccount -> getTransactions for:' + accountHash);
        console.error(e);
        return account.transactions;
      });
  }

  return account;
}