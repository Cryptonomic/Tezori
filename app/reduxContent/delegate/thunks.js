import { TezosOperations } from 'conseiljs';
import { addMessage } from '../../reduxContent/message/thunks';
import { updateIdentity } from '../../reduxContent/wallet/actions';
import { displayError } from '../../utils/formValidation';
import { getSelectedNode } from '../../utils/nodes';
import { findIdentity } from '../../utils/identity';
import { findAccountIndex } from '../../utils/account';
import { TEZOS } from '../../constants/NodesTypes';
import { persistWalletState } from '../../utils/wallet';
import { createTransaction } from '../../utils/transaction';
import { DELEGATION } from '../../constants/TransactionTypes';

import {
  getSelectedKeyStore,
  fetchAverageFees,
  clearOperationId
} from '../../utils/general';

const { sendDelegationOperation } = TezosOperations;

export function fetchDelegationAverageFees() {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const averageFees = await fetchAverageFees(nodes, 'delegation');
    return averageFees;
  };
}

export function validateAddress(address) {
  return async dispatch => {
    const validations = [
      { value: address, type: 'notEmpty', name: 'address' },
      { value: address, type: 'validAddress' }
    ];

    const error = displayError(validations);
    if (error) {
      dispatch(addMessage(error, true));
      return false;
    }

    return true;
  };
}

export function delegate(
  delegateValue,
  fee,
  password,
  selectedAccountHash,
  selectedParentHash
) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const walletPassword = state().wallet.get('password');

    if (password !== walletPassword) {
      const error = "components.messageBar.messages.incorrect_password";
      dispatch(addMessage(error, true));
      return false;
    }

    const keyStore = getSelectedKeyStore(
      identities,
      selectedAccountHash,
      selectedParentHash
    );
    const { url } = getSelectedNode(nodes, TEZOS);
    const res = await sendDelegationOperation(
      url,
      keyStore,
      delegateValue,
      fee
    ).catch(err => {
      const errorObj = { name: err.message, ...err };
      console.error(errorObj);
      dispatch(addMessage(errorObj.name, true));
      return false;
    });

    if (res) {
      const operationResult = res
        && res.results
        && res.results.contents
        && res.results.contents[0]
        && res.results.contents[0].metadata
        && res.results.contents[0].metadata.operation_result;

      if ( operationResult && operationResult.errors && operationResult.errors.length ) {
        const error = "components.messageBar.messages.delegation_operation_failed";
        console.error(error);
        dispatch(addMessage(error, true));
        return false;
      }

      const clearedOperationId = clearOperationId(res.operationGroupID);
      
      dispatch(
        addMessage(
          "components.messageBar.messages.success_delegation_update",
          false,
          clearedOperationId
        )
      );

      const identity = findIdentity(identities, selectedParentHash);
      const delegateIdentity = findIdentity(identities, delegateValue);
      const foundIndex = findAccountIndex(identity, selectedAccountHash);
      const account = identity.accounts[foundIndex];

      const transaction = createTransaction({
        delegate: delegateValue,
        kind: DELEGATION,
        source: keyStore.publicKeyHash,
        operationGroupHash: clearedOperationId,
        fee
      });

      if ( foundIndex > -1 ) {
        account.transactions.push(transaction);
        identity.accounts[foundIndex] = {
          ...account,
          delegateValue: ''
        };

        dispatch(updateIdentity(identity));
      }

      console.log('delegateIdentity', delegateIdentity);
      if ( delegateIdentity ) {
        delegateIdentity.transactions.push(transaction);
        dispatch(updateIdentity(delegateIdentity));
      }

      await persistWalletState(state().wallet.toJS());
      return true;
    }
    return false;
  };
}