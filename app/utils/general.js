import { shell } from 'electron';
import { pick } from 'lodash';
import { fromJS } from 'immutable';
import { flatten } from 'lodash';
import {
  ConseilQueryBuilder,
  ConseilOperator,
  ConseilSortDirection,
  TezosConseilClient,
  TezosNodeReader,
  TezosWalletUtil
} from 'conseiljs';

import { findAccount, createSelectedAccount } from './account';
import { findIdentity } from './identity';
import { createTransaction } from './transaction';
import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { MNEMONIC, LEDGER } from '../constants/StoreTypes';
import { SEND, TRANSACTIONS } from '../constants/TabConstants';
import { getSelectedNode } from './nodes';
import { blockExplorerHost } from '../config.json';

const util = require('util')

export async function getNodesStatus(nodes, network) {
  const selectedTezosNode = getSelectedNode(nodes, TEZOS);
  const tezRes = await TezosNodeReader.getBlockHead(selectedTezosNode.url).catch((err) => { console.error(err); return false; });
  const selectedConseilNode = getSelectedNode(nodes, CONSEIL);
  const consRes = await TezosConseilClient.getBlockHead({ url: selectedConseilNode.url, apiKey: selectedConseilNode.apiKey }, network).catch((err) => { console.error(err); return false; });
  console.log(`-debug: tezos status: ${JSON.stringify(tezRes)}, conseil status: ${JSON.stringify(consRes)}`);

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
      consRes && consRes[0] &&
      {
        responsive: true,
        level: Number(consRes[0].level)
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
  const { publicKey, privateKey, publicKeyHash, account_id } = selectedAccount.toJS();
  return {
    publicKey,
    privateKey,
    publicKeyHash: publicKeyHash || account_id
  };
}

export async function activateAndUpdateAccount(account, keyStore, nodes, isLedger = false, network) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);
  if (account.status === status.READY) {
    const accountHash = account.publicKeyHash || account.account_id;
    const updatedAccount = await TezosConseilClient.getAccount({url: url, apiKey: apiKey}, network, accountHash)
      .catch((error) => {
        console.log('-debug: Error in: status.READY for:' + accountHash);
        console.error(error);
        return null;
    });
    if (updatedAccount && updatedAccount[0]) {
      console.log('ready ' + util.inspect(updatedAccount, false, null, false));
      account.balance = parseInt(updatedAccount[0].balance);
    }
    return account;
  }

  if (account.status === status.INACTIVE) {
    //  delete account
  }

  if (account.status === status.CREATED) {
    const accountHash = account.publicKeyHash || account.account_id;

    const updatedAccount = await TezosConseilClient.getAccount({url: url, apiKey: apiKey}, network, accountHash)
      .catch((error) => {
        console.log('-debug: Error in: status.CREATED for:' + accountHash);
        console.error(error);
        return null;
    });

    if (updatedAccount && updatedAccount[0]) {
      console.log('created ' + util.inspect(updatedAccount, false, null, false));
      account.balance = parseInt(updatedAccount[0].balance);
      account.status = status.FOUND;
    }
  }

  if (account.status === status.FOUND) {
    account.status = status.READY;
  }

  console.log('-debug: account.status ', account.status);
  return account;
}

export function generateNewMnemonic() {
  return TezosWalletUtil.generateMnemonic();
}

const getFeeCount = (counts) => {
  const lowCount = Math.round(counts * 0.3);
  const mediumCount = Math.round(counts * 0.4);
  const highCount = counts - lowCount - mediumCount;
  return [lowCount, mediumCount, highCount];
}

export async function fetchAverageFees(settings, operationKind) {
  const { url, apiKey } = getSelectedNode(settings, CONSEIL);
  const { network } = settings;

  let operationFeesQuery = ConseilQueryBuilder.blankQuery();
  operationFeesQuery = ConseilQueryBuilder.addFields(operationFeesQuery, 'fee');
  operationFeesQuery = ConseilQueryBuilder.addPredicate(operationFeesQuery, 'kind', ConseilOperator.EQ, [operationKind], false);
  operationFeesQuery = ConseilQueryBuilder.addOrdering(operationFeesQuery, 'block_level', ConseilSortDirection.DESC);
  operationFeesQuery = ConseilQueryBuilder.addOrdering(operationFeesQuery, 'fee', ConseilSortDirection.ASC);
  operationFeesQuery = ConseilQueryBuilder.setLimit(operationFeesQuery, 1000);

  const fees = await TezosConseilClient.getOperations({url: url, apiKey: apiKey}, network, operationFeesQuery);
  const sortedfees = fees.map(f => parseInt(f['fee'])).sort((a, b) => a - b);
  const feeCounts = getFeeCount(sortedfees.length);

  const lowAverageFee = Math.round(sortedfees.slice(0, feeCounts[0]).reduce((s, c) => s + c) / feeCounts[0]);
  const mediumAverageFee = Math.round(sortedfees.slice(feeCounts[0], feeCounts[0] + feeCounts[1]).reduce((s, c) => s + c) / feeCounts[1]);
  const highAverageFee = Math.round(sortedfees.slice(feeCounts[0] + feeCounts[1]).reduce((s, c) => s + c) / feeCounts[2]);

  return {low: lowAverageFee, medium: mediumAverageFee, high: highAverageFee};
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
