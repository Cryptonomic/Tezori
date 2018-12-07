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
import { createTransaction } from './transaction';
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { MNEMONIC, LEDGER } from '../constants/StoreTypes';
import { SEND, TRANSACTIONS } from '../constants/TabConstants';
import { getSelectedNode } from './nodes';
import { blockExplorerHost } from '../config.json';

const { getEmptyTezosFilter, getOperations, getAccount, getAverageFees } = TezosConseilQuery;
const { generateMnemonic } = TezosWallet;

export async function getNodesStatus(nodes) {
  const selectedTezosNode = getSelectedNode(nodes, TEZOS);
  const tezRes = await TezosNode.getBlockHead(selectedTezosNode.url).catch((err) => {
    console.error(err);
    return false;
  });
  const selectedConseilNode = getSelectedNode(nodes, CONSEIL);
  const consRes = await TezosConseilQuery.getBlockHead(selectedConseilNode.url, selectedConseilNode.apiKey).catch((err) => {
    console.error(err);
    return false;
  });

  console.log('-debug: tezRes, consRes', tezRes, consRes);
  return {
    tezos: Object.assign(
      {
        responsive: false,
        level: null
      },
      tezRes && tezRes.header &&
      {
        responsive: true,
        level: Number(tezRes.header.level)
      },
    ),
    conseil: Object.assign(
      {
        responsive: false,
        level: null
      },
      consRes &&
      {
        responsive: true,
        level: Number(consRes.level)
      },
    )
  };
}

export function getNodesError({ tezos, conseil }) {
  if ( !tezos.responsive || !conseil.responsive ) {
    return 'nodes.errors.wrong_server';
  }

  if ( (conseil.level - tezos.level) > 5 ) {
    return 'nodes.errors.wrong_network';
  }

  if ( (tezos.level - conseil.level) > 5 ) {
    return 'nodes.errors.not_synced';
  }

  return false;
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

export async function activateAndUpdateAccount(account, keyStore, nodes, isLedger = false) {
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
      account.status = status.READY;
  }

  console.log('-debug: account.status ', account.status);
  return account;
}

export function generateNewMnemonic() {
  return generateMnemonic();
}

export async function fetchAverageFees(settings, operationKind) {
  const { url, apiKey } = getSelectedNode(settings, CONSEIL);
  const emptyFilter = getEmptyTezosFilter();
  const feeFilter = {...emptyFilter, limit: 1000, operation_kind: [ operationKind ]};
  return await getAverageFees(url, feeFilter, apiKey);
}

export function isReady(addressStatus, storeType, tab) {
  return addressStatus === status.READY
    ||
    (storeType === MNEMONIC && addressStatus === status.CREATED && tab !== SEND)
    ||
    (storeType === MNEMONIC && addressStatus !== status.CREATED && tab === TRANSACTIONS)
    ||
    (storeType === LEDGER && addressStatus === status.CREATED && tab !== SEND)
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
    return operationId.replace(/\\|"|\n|\r/g, '');
  }
  return operationId;
}
