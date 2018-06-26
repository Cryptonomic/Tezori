import { pick  } from 'lodash';
import { TezosConseilQuery, TezosOperations  } from 'conseiljs';
import { fromJS } from 'immutable';
import { flatten } from 'lodash';
import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';

const { getEmptyTezosFilter, getOperations } = TezosConseilQuery;
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
  let selectedAccount = null;
  if (selectedAccountHash === selectedParentHash) {
    selectedAccount = findIdentity( identities, selectedAccountHash );
  } else {
    const identity = findIdentity( identities, selectedParentHash );
    selectedAccount = findAccount( identity, selectedAccountHash );
  }

  return fromJS(selectedAccount || createSelectedAccount() );
}

export function getKeyStore(identity) {
  return pick(identity, [ 'publicKey', 'privateKey', 'publicKeyHash' ]);
}

export async function revealKey(network, keyStore, fee) {
  //console.log('network, keyStore, fee', network, keyStore, fee);
  const keyRevealed = await isManagerKeyRevealedForAccount(network, keyStore);
  //console.log(`---------------------------------------------------------------------------
  //---------------------------------${ keyRevealed }------------------------------------------------`);
  if ( !keyRevealed ) {
    await sendKeyRevealOperation(network, keyStore, fee);
  }
  //console.log(`---------------------------------------------------------------------------
  //--------------------------------- end ------------------------------------------------`);
}