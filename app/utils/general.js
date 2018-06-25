import { TezosConseilQuery  } from 'conseiljs';
import { fromJS } from 'immutable';
const { getOperationGroup } = TezosConseilQuery;
import OPERATION_TYPES from '../constants/OperationTypes';
import { flatten } from 'lodash';
import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';

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

export async function getTransactions(operationGroups, network) {
  const managerOperationGroups = (operationGroups || [] ).filter(({ kind }) => {
    return kind === OPERATION_TYPES.MANAGER;
  });

  const transactionPromises = ( managerOperationGroups || [] ).map(({ hash }) => {
    return getOperationGroup(network, hash).then(({ operations }) => {
      return operations.filter(
        ({ opKind }) => opKind === OPERATION_TYPES.TRANSACTION
      );
    });
  });

  const transactions = await Promise.all(transactionPromises);
  return flatten(transactions);
}

export function getSelectedAccount( identities, selectedAccountHash, selectedParentHash ) {
  let selectedAccount = findIdentity(identities, selectedAccountHash);
  if (selectedAccountHash === selectedParentHash) {
    selectedAccount = findAccount( selectedAccount, selectedAccountHash );
  }

  return fromJS(selectedAccount || createSelectedAccount() );
}