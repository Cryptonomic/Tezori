import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';
const { getAccounts, getEmptyTezosFilter } = TezosConseilQuery;
import * as status from '../constants/StatusTypes';
import { getTransactions, activateAndUpdateAccount, getSelectedKeyStore } from './general';

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

export async function getAccountsForIdentity(network, id) {
  const emptyFilter = getEmptyTezosFilter();
  const filter = {...emptyFilter, account_manager: [id]};
  const accounts = await getAccounts(network, filter);
  return accounts.filter(account => account.accountId !== id);
}

export async function getSyncAccount(identities, account, network, selectedAccountHash, selectedParentHash ) {
  const publicKeyHash  = account.accountId;
  console.log( ' selectedAccountHash, selectedParentHash ', selectedAccountHash, selectedParentHash);
  console.log( ' publicKeyHash ', publicKeyHash );
  const keyStore = getSelectedKeyStore( identities, publicKeyHash, selectedParentHash );

  account =  await activateAndUpdateAccount( account, keyStore, network ).catch( e => {
    console.log('-debug: Error in: getSyncAccount for:' + publicKeyHash);
    console.error(e);
    return account;
  });

  if ( publicKeyHash === selectedAccountHash ) {
    account.transactions = await getTransactions(publicKeyHash, network)
      .catch( e => {
        console.log('-debug: Error in: getSyncAccount -> getTransactions for:' + publicKeyHash);
        console.error(e);
        return account.transactions;
      });
  }

  return account;
}