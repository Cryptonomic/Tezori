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
    operationGroups: [],
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

export function createSelectedAccount({ balance = 0, operationGroups = [], transactions = [] } = {}) {
  return { balance, operationGroups, transactions };
}
