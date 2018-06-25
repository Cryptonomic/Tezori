export function createIdentity(identity) {

  return {
    transactions: [],
    balance: 0,
    operationGroups: {},
    accounts: [],
    publicKeyHash: '', 
    publicKey: '',
    privateKey: '',
    ...identity
  };
}

export function findIdentity(identities, publicKeyHash) {
  return (identities || []).find( identity => identity.publicKeyHash === publicKeyHash );
}