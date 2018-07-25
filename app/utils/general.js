import { shell } from 'electron';
import { pick  } from 'lodash';
import {
  TezosConseilQuery,
  TezosNode,
  TezosOperations,
  TezosWallet
} from 'conseiljs';

import { fromJS } from 'immutable';
import { flatten } from 'lodash';
import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { MNEMONIC } from '../constants/StoreTypes';
import { SEND, TRANSACTIONS } from '../constants/TabConstants';
import { getSelectedNode } from './nodes';
import { blockExplorerHost } from '../config.json';

const { getEmptyTezosFilter, getOperations, getAccount, getAverageFees } = TezosConseilQuery;
const { isManagerKeyRevealedForAccount, sendKeyRevealOperation } = TezosOperations;
const { generateMnemonic } = TezosWallet;


export async function isServerResponsive(nodes) {
  const selectedTezosNode = getSelectedNode(nodes, TEZOS);
  const tezRes = await TezosNode.getBlockHead(selectedTezosNode.url).catch(() => false );
  const selectedConseilNode = getSelectedNode(nodes, CONSEIL);
  const consRes = await TezosConseilQuery.getBlockHead(selectedConseilNode.url, selectedConseilNode.apiKey).catch(() => false );
  return tezRes && consRes;
}

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

export function getSelectedHash() {
  let hash = location.hash.replace(/$\//, '');
  let segments = hash.split('/');
  const selectedParentHash = segments.pop();
  const selectedAccountHash = segments.pop();
  return {
    selectedParentHash,
    selectedAccountHash
  };
}

export async function getTransactions(accountHash, nodes) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);
  const emptyFilter = getEmptyTezosFilter();
  const transFilter = {
    ...emptyFilter,
    limit: 100,
    operation_participant: [ accountHash ],
    operation_kind: [ 'transaction', 'activate_account', 'reveal', 'origination', 'delegation' ]
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
  const { url, apiKey } = getSelectedNode(nodes, TEZOS);
  return await isManagerKeyRevealedForAccount(url, keyStore);
}

export async function revealKey(nodes, keyStore) {
  const keyRevealed = await isRevealed(nodes, keyStore);
  if ( !keyRevealed ) {
    const { url, apiKey } = getSelectedNode(nodes, TEZOS);
    return await sendKeyRevealOperation(url, keyStore, 0);
  }
  return true;
}

export async function activateAndUpdateAccount(account, keyStore, nodes) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);
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
    console.log( '-debug - nodes, keyStore', nodes, keyStore);
    const revealed = await revealKey(nodes, keyStore).catch( (error) => {
      console.log('-debug: Error in: status.FOUND for:' + (account.publicKeyHash || account.accountId));
      console.error(error);
      return false;
    });
    if ( revealed ) {
      account.status = status.PENDING;
      account.operations[status.FOUND] = clearOperationId(revealed.operationGroupID)
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

export function generateNewMnemonic() {
  return generateMnemonic();
}

export async function fetchAverageFees(nodes, operationKind) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);
  const emptyFilter = getEmptyTezosFilter();
  const feeFilter = {...emptyFilter, limit: 1000, operation_kind: [ operationKind ]};
  return await getAverageFees(url, feeFilter, apiKey);
}

export function isReady(addressStatus, storeTypes, tab) {
  return addressStatus === status.READY
    ||
    (storeTypes === MNEMONIC && addressStatus === status.CREATED && tab !== SEND)
    ||
    (storeTypes === MNEMONIC && addressStatus !== status.CREATED && tab === TRANSACTIONS)
    ;
}

export function openLink(link) {
  shell.openExternal(link);
}

export function openLinkToBlockExplorer( url ) {
  openLink(blockExplorerHost + url);
}

export function clearOperationId( operationId ) {
  if ( typeof operationId === 'string' ) {
    return operationId.replace(/"/g, '');
  }
  return operationId;
}

/*
const state = {
  identities: [
    {
      publicKeyHash:'',
      order: 0,
      status: 'ready',
      storeTypes: '',
      balance: '',
      operations: {},
      transactions: [],
      accounts: [
        {
          accountId: '',
          order: 0,
          balance: 0,
          delegateValue: null,
          manager: '',
          transactions: [],
          status: 'ready',
          operations: {}
        }
      ]
    }
  ]
};

 amount
 :
 null
 balance
 :
 "154000000"
 blockHash
 :
 "BMDujqeRpDC4HFmHDmRekzs1XFt8SZEtWRM5NwEFFu5bykpkBMN"
 blockLevel
 :
 11225
 delegate
 :
 "tz1anMWAvvrGoR7XRK3XvmJcq7pdB8fbSWRZ"
 destination
 :
 null
 fee
 :
 "116717"
 gasLimit
 :
 null
 kind
 :
 "origination"
 operationGroupHash
 :
 "opEqK5QDwgjXfHXssnjuEojBrkRhATS497X8twkMeqggz2xbRXf"
 operationId
 :
 997116
 pkh
 :
 null
 source
 :
 "tz1cnkCgZ6Q7EcTMoRGsc4ukDzgUmUGCMQmX"
 storageLimit
 :
 null
 timestamp
 :
 1532401947000
*/
