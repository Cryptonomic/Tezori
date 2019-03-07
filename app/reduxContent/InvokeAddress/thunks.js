import { TezosNodeWriter } from 'conseiljs';
import { updateIdentity } from '../../reduxContent/wallet/actions';
import { addMessage } from '../../reduxContent/message/thunks';
import { tezToUtez } from '../../utils/currancy';
import { getSelectedNode } from '../../utils/nodes';
import { getCurrentPath } from '../../utils/paths';
import { TEZOS } from '../../constants/NodesTypes';
import { persistWalletState } from '../../utils/wallet';
import { createTransaction } from '../../utils/transaction';
import { INVOCATION } from '../../constants/TransactionTypes';

import { getSelectedKeyStore, clearOperationId } from '../../utils/general';

import { findAccountIndex } from '../../utils/account';
import { findIdentity } from '../../utils/identity';

const { sendContractInvocationOperation } = TezosNodeWriter;

const invokeAddress = (
  smartAddress,
  fee,
  amount,
  storage,
  gas,
  parameters,
  password,
  selectedAccountHash,
  selectedParentHash
) => {
  return async (dispatch, state) => {
    const settings = state().settings.toJS();
    const isLedger = state().wallet.get('isLedger');
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const walletPassword = state().wallet.get('password');

    if (password !== walletPassword && !isLedger) {
      const error = 'components.messageBar.messages.incorrect_password';
      dispatch(addMessage(error, true));
      return false;
    }

    const keyStore = getSelectedKeyStore(
      identities,
      selectedAccountHash,
      selectedParentHash
    );
    console.log('keystore----', keyStore);
    const { url } = getSelectedNode(settings, TEZOS);
    const parsedAmount = tezToUtez(Number(amount.replace(/,/g, '.')));
    const newParams = JSON.parse(parameters);
    let res;
    if (isLedger) {
      const newKeyStore = keyStore;
      const { derivation } = getCurrentPath(settings);
      newKeyStore.storeType = 2;
      res = await sendContractInvocationOperation(
        url,
        newKeyStore,
        smartAddress,
        parsedAmount,
        fee,
        derivation,
        storage,
        gas,
        newParams
      ).catch(err => {
        const errorObj = { name: err.message, ...err };
        console.error(err);
        dispatch(addMessage(errorObj.name, true));
        return false;
      });
    } else {
      res = await sendContractInvocationOperation(
        url,
        keyStore,
        smartAddress,
        parsedAmount,
        fee,
        '',
        storage,
        gas,
        newParams
      ).catch(err => {
        const errorObj = { name: err.message, ...err };
        console.error(err);
        dispatch(addMessage(errorObj.name, true));
        return false;
      });
    }

    if (res) {
      const operationResult =
        res &&
        res.results &&
        res.results.contents &&
        res.results.contents[0] &&
        res.results.contents[0].metadata &&
        res.results.contents[0].metadata.operation_result;

      if (
        operationResult &&
        operationResult.errors &&
        operationResult.errors.length
      ) {
        const error = 'components.messageBar.messages.invoke_operation_failed';
        console.error(operationResult.errors);
        dispatch(addMessage(error, true));
        return false;
      }

      console.log('res-------', res);

      const clearedOperationId = clearOperationId(res.operationGroupID);

      dispatch(
        addMessage(
          'components.messageBar.messages.success_invoke_operation',
          false,
          clearedOperationId
        )
      );

      const identity = findIdentity(identities, selectedParentHash);
      const transaction = createTransaction({
        amount: parsedAmount,
        destination: smartAddress,
        kind: INVOCATION,
        source: keyStore.publicKeyHash,
        operation_group_hash: clearedOperationId,
        fee,
        gas_limit: gas,
        storage_limit: storage
      });

      if (selectedParentHash === selectedAccountHash) {
        identity.transactions.push(transaction);
      } else {
        const accountIndex = findAccountIndex(identity, selectedAccountHash);
        if (accountIndex > -1) {
          identity.accounts[accountIndex].transactions.push(transaction);
        }
      }

      dispatch(updateIdentity(identity));

      await persistWalletState(state().wallet.toJS());
      return true;
    }
    return false;
  };
};

export default invokeAddress;
