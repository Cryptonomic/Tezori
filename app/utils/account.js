import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';
const { getAccounts, getEmptyTezosFilter } = TezosConseilQuery;
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { getTransactions, activateAndUpdateAccount, getSelectedKeyStore } from './general';
import { getSelectedNode } from './nodes';

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
    status: status.CREATED,
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

export async function getSyncAccount(identities, account, nodes, selectedAccountHash, selectedParentHash ) {
  const publicKeyHash  = account.accountId;
  const keyStore = getSelectedKeyStore( identities, publicKeyHash, selectedParentHash );

  account =  await activateAndUpdateAccount( account, keyStore, nodes ).catch( e => {
    console.log('-debug: Error in: getSyncAccount for:' + publicKeyHash);
    console.error(e);
    return account;
  });

  if ( publicKeyHash === selectedAccountHash ) {
    account.transactions = await getTransactions(publicKeyHash, nodes)
      .catch( e => {
        console.log('-debug: Error in: getSyncAccount -> getTransactions for:' + publicKeyHash);
        console.error(e);
        return account.transactions;
      });
  }

  return account;
}