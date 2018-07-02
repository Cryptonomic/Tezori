import { pick  } from 'lodash';
import { TezosConseilQuery, TezosOperations  } from 'conseiljs';
import { fromJS } from 'immutable';
import { flatten } from 'lodash';
import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { getSelected } from './nodes';

const { getEmptyTezosFilter, getOperations, getAccount } = TezosConseilQuery;
const { isManagerKeyRevealedForAccount, sendKeyRevealOperation } = TezosOperations;
/**
 *
 * @param timeout - number of seconds to wait
 * @returns { Promise }
 */
export function awaitFor(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout*1000);
  });
}

export async function getTransactions(accountHash, nodes) {
  const { url, apiKey } = getSelected(nodes, CONSEIL);
  const emptyFilter = getEmptyTezosFilter();
  const transFilter = {
    ...emptyFilter,
    limit: 100,
    operation_participant: [ accountHash ],
    operation_kind: [ 'transaction' ]
  };
  return await getOperations(url, transFilter, apiKey);
}

export function getSelectedAccount( identities, selectedAccountHash, selectedParentHash ) {
  let selectedAccount = null;
  if (selectedAccountHash === selectedParentHash) {
    selectedAccount = findIdentity( identities, selectedAccountHash );
  } else {
    const identity = findIdentity( identities, selectedParentHash );
    selectedAccount = findAccount( identity, selectedAccountHash );
  }

  return fromJS(selectedAccount || createSelectedAccount() );
}

export function getSelectedKeyStore( identities, selectedAccountHash, selectedParentHash ) {
  var selectedAccount = getSelectedAccount( identities, selectedAccountHash, selectedParentHash );
  const { publicKey, privateKey, publicKeyHash, accountId } = selectedAccount.toJS();
  return {
    publicKey,
    privateKey,
    publicKeyHash: publicKeyHash || accountId
  };
}

export async function isRevealed(nodes, keyStore) {
  const { url, apiKey } = getSelected(nodes, TEZOS);
  return await isManagerKeyRevealedForAccount(url, keyStore);
}

export async function revealKey(nodes, keyStore) {
  const keyRevealed = await isRevealed(nodes, keyStore);
  if ( !keyRevealed ) {
    const { url, apiKey } = getSelected(nodes, TEZOS);
    await sendKeyRevealOperation(url, keyStore, 0);
  }
  return true;
}

export async function activateAndUpdateAccount(account, keyStore, nodes) {
  const { url, apiKey } = getSelected(nodes, CONSEIL);
  if ( account.status === status.READY ) {
    const accountHash = account.publicKeyHash || account.accountId;
    const updatedAccount = await getAccount(url, accountHash, apiKey).catch( (error) => {
      console.log('-debug: Error in: status.READY for:' + accountHash);
      console.error(error);
      return false;
    });
    if ( updatedAccount ) {
      account.balance = updatedAccount.account.balance;
    }
    return account;
  }
  
  if ( account.status === status.INACTIVE ) {
    //  delete account
  }

  if ( account.status === status.CREATED ) {
    const accountHash = account.publicKeyHash || account.accountId;
    const updatedAccount = await getAccount(url, accountHash, apiKey).catch( (error) => {
      console.log('-debug: Error in: status.CREATED for:' + accountHash);
      console.error(error);
      return false;
    });
    if ( updatedAccount ) {
      account.balance = updatedAccount.account.balance;
      account.status = status.FOUND;
    }
  }

  if ( account.status === status.FOUND ) {
    const revealed = await revealKey(nodes, keyStore).catch( (error) => {
      console.log('-debug: Error in: status.FOUND for:' + (account.publicKeyHash || account.accountId));
      console.error(error);
      return false;
    });
    if ( revealed ) {
      account.status = status.PENDING;
    }
  }

  if ( account.status === status.PENDING ) {
    const response = await isRevealed(nodes, keyStore).catch( (error) => {
      console.log('-debug: Error in: status.PENDING for:' + (account.publicKeyHash || account.accountId));
      console.error(error);
      return false;
    });
    if ( response ) {
      account.status = status.READY;
    }
  }

  console.log('-debug: account.status ', account.status);
  return account;
}