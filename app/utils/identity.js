import * as status from '../constants/StatusTypes';

export function createIdentity(identity) {

  return {
    transactions: [],
    balance: 0,
    accounts: [],
    publicKeyHash: '', 
    publicKey: '',
    privateKey: '',
    status: status.CREATED,
    ...identity
  };
}

export function findIdentity(identities, publicKeyHash) {
  return (identities || []).find( identity => identity.publicKeyHash === publicKeyHash );
}

export function findIdentityIndex(identities, publicKeyHash) {
  return (identities || []).findIndex( identity => identity.publicKeyHash === publicKeyHash );
}