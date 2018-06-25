import { TezosWallet, TezosConseilQuery, TezosOperations  } from 'conseiljs';
const { getAccounts, getEmptyTezosFilter } = TezosConseilQuery;

export function createAccount(account, identity) {

  return {
    accountId: '',
    balance: 0,
    blockId: '',
    counter: 0,
    delegateSetable: false,
    delegateValue: null,
    manager: 'tz1TRWQpmnmQzi9GTrwKWvJAUDYm8TCruiXo',
    script: null,
    spendable: false,
    transactions: [],
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    ...account
  };
}

export function findAccount( identity, accountId ) {
  return identity && ( identity.accounts || [] )
      .find( account => account.accountId === accountId );
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