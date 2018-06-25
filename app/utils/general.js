import { TezosConseilQuery  } from 'conseiljs';
import { fromJS } from 'immutable';
import { flatten } from 'lodash';
import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';

const { getEmptyTezosFilter, getOperations } = TezosConseilQuery;
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

export async function getTransactions(accountHash, network) {
  const emptyFilter = getEmptyTezosFilter();
  const transFilter = {
    ...emptyFilter,
    limit: 100,
    operation_participant: [ accountHash ],
    operation_kind: [ 'transaction' ]
  };
  return await getOperations(network, transFilter);
}

export function getSelectedAccount( identities, selectedAccountHash, selectedParentHash ) {
  let selectedAccount = findIdentity(identities, selectedAccountHash);
  if (selectedAccountHash === selectedParentHash) {
    selectedAccount = findAccount( selectedAccount, selectedAccountHash );
  }

  return fromJS(selectedAccount || createSelectedAccount() );
}