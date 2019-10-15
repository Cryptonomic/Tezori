import {ConseilQuery, ConseilQueryBuilder, ConseilOperator, ConseilPredicate, ConseilOrdering, ConseilSortDirection, TezosConseilClient, TezosNode, TezosOperations} from 'conseiljs';

import * as status from '../constants/StatusTypes';
import { TEZOS, CONSEIL } from '../constants/NodesTypes';
import { getSelectedNode } from './nodes';

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
    block_hash: null,
    block_level: null,
    delegate: null,
    destination: null,
    fee: null,
    gas_limit: null,
    kind: null,
    operation_group_hash: null,
    operation_id: null,
    pkh: null,
    status: status.CREATED,
    source: null,
    storage_limit: null,
    timestamp: Date.now(),
    ...newTransaction
  };
}

export async function getTransactions(accountHash, nodes, network) {
  const { url, apiKey } = getSelectedNode(nodes, CONSEIL);

  let origin = ConseilQueryBuilder.blankQuery();
  origin = ConseilQueryBuilder.addPredicate(origin, 'kind', ConseilOperator.IN, ['transaction', 'activate_account', 'reveal', 'origination', 'delegation'], false);
  origin = ConseilQueryBuilder.addPredicate(origin, 'source', ConseilOperator.EQ, [accountHash], false);
  target = ConseilQueryBuilder.addPredicate(origin, 'internal', ConseilOperator.EQ, ["false"], false);
  origin = ConseilQueryBuilder.addOrdering(origin, 'block_level', ConseilSortDirection.DESC);
  origin = ConseilQueryBuilder.setLimit(origin, 300);

  let target = ConseilQueryBuilder.blankQuery();
  target = ConseilQueryBuilder.addPredicate(target, 'kind', ConseilOperator.IN, ['transaction', 'activate_account', 'reveal', 'origination', 'delegation'], false);
  target = ConseilQueryBuilder.addPredicate(target, 'destination', ConseilOperator.EQ, [accountHash], false);
  target = ConseilQueryBuilder.addPredicate(target, 'internal', ConseilOperator.EQ, ["false"], false);
  target = ConseilQueryBuilder.addOrdering(target, 'block_level', ConseilSortDirection.DESC);
  target = ConseilQueryBuilder.setLimit(target, 300);

  return Promise.all([target, origin].map(q => TezosConseilClient.getOperations({url: url, apiKey: apiKey}, network, q)))
          .then(responses => responses.reduce((result, r) => { r.forEach(rr => result.push(rr)); return result; }));
  // TODO sort by timestamp
}

export function syncTransactionsWithState(syncTransactions, stateTransactions) {
  const newTransactions = stateTransactions.filter(
    stateTransaction =>
      !syncTransactions.find(
        syncTransaction =>
          syncTransaction.operation_group_hash === stateTransaction.operation_group_hash
      )
  );

  return syncTransactions.concat(newTransactions);
}

export async function getSyncTransactions(
  accountHash,
  nodes,
  stateTransactions,
  network
) {
  let newTransactions = await getTransactions(accountHash, nodes, network).catch(e => {
    console.log('-debug: Error in: getSyncAccount -> getTransactions for:' + accountHash);
    console.error(e);
    return [];
  });

  newTransactions = newTransactions.map(transaction =>
    createTransaction({
      ...transaction,
      status: status.READY
    })
  );

  return syncTransactionsWithState(newTransactions, stateTransactions);
}
