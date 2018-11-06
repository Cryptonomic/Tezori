import {
  TezosConseilQuery,
  TezosNode,
  TezosOperations,
  TezosWallet
} from 'conseiljs-staging';

import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { getSelectedNode } from './nodes';

const { getEmptyTezosFilter, getOperations } = TezosConseilQuery;

export function createTransaction(transaction) {
  const newTransaction = transaction;

  if (typeof newTransaction.balance === 'string') {
    newTransaction.balance = Number(newTransaction.balance);
  }

  if (typeof newTransaction.fee === 'string') {
    newTransaction.fee = Number(newTransaction.fee);
  }
  
  if (typeof newTransaction.amount === 'string') {
    newTransaction.amount = Number(newTransaction.amount);
  }
  
  return {
    amount: null,
    balance: null,
    blockHash: null,
    blockLevel: null,
    delegate: null,
    destination: null,
    fee: null,
    gasLimit: null,
    kind: null,
    operationGroupHash: null,
    operationId: null,
    pkh: null,
    status: status.CREATED,
    source: null,
    storageLimit: null,
    timestamp: Date.now(),
    ...newTransaction
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

export function syncTransactionsWithState(syncTransactions, stateTransactions) {
  const newTransactions = stateTransactions
    .filter(stateTransaction =>
      !syncTransactions
        .find(syncTransaction =>
          syncTransaction.operationGroupHash === stateTransaction.operationGroupHash
        )
    );

  return syncTransactions.concat(newTransactions);
}

export async function getSyncTransactions(accountHash, nodes, stateTransactions) {
  let newTransactions = await getTransactions(accountHash, nodes)
    .catch( e => {
      console.log('-debug: Error in: getSyncAccount -> getTransactions for:' + accountHash);
      console.error(e);
      return [];
    });

  newTransactions = newTransactions
    .map(transaction =>
      createTransaction({
        ...transaction,
        status: status.READY
      })
    );
  
  return syncTransactionsWithState(newTransactions, stateTransactions);
}