import { TezosOperations } from 'conseiljs';
import { addNewAccount } from '../../redux/wallet/actions';
import { addMessage } from '../../reducers/message.duck';
import { displayError } from '../../utils/formValidation';
import { tezToUtez } from '../../utils/currancy';
import { createAccount } from '../../utils/account';
import { getSelectedKeyStore } from '../../utils/general'
import { findIdentity } from '../../utils/identity';
import { getSelectedNode } from '../../utils/nodes';
import { TEZOS } from '../../constants/NodesTypes';

const { sendOriginationOperation } = TezosOperations;

export function createNewAccount( delegate, amount, fee, passPhrase ) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const walletPassword = state().wallet.get('password');
    const publicKeyHash = state().wallet.get('selectedParentHash');
    const identities = state().wallet.get('identities').toJS();
    const parsedAmount = Number(amount.replace(/\,/g,''));
    const amountInUtez = tezToUtez(parsedAmount);

    const validations = [
      { value: amount, type: 'notEmpty', name: 'Amount'},
      { value: parsedAmount, type: 'validAmount'},
      { value: amountInUtez, type: 'posNum', name: 'Amount'},
      { value: passPhrase, type: 'notEmpty', name: 'Pass Phrase'},
      { value: passPhrase, type: 'minLength8', name: 'Pass Phrase' }
    ];

    const error = displayError(validations);
    if (error) {
      dispatch(addMessage(error, true));
      return false;
    }

    if ( passPhrase !== walletPassword ) {
      const error = 'Incorrect password';
      dispatch(addMessage(error, true));
      return false;
    }

    const identity = findIdentity(identities, publicKeyHash);
    const keyStore = getSelectedKeyStore(identities, publicKeyHash, publicKeyHash);
    const { url, apiKey } = getSelectedNode(nodes, TEZOS);
    console.log('-debug: - iiiii - url, apiKey', url, apiKey);
    const newAccount = await sendOriginationOperation(
      url,
      keyStore,
      amountInUtez,
      delegate,
      true,
      true,
      fee
    ).catch((err) => {
      err.name = err.message;
      console.error(err);
      dispatch(addMessage(err.name, true));
      return false;
    });

    if ( newAccount ) {
      const newAccountHash =
        newAccount.results.contents[0].metadata.operation_result.originated_contracts[0];

      dispatch(
        addNewAccount(
          publicKeyHash,
          createAccount({
              accountId: newAccountHash,
              balance: amountInUtez,
              manager: publicKeyHash,
              delegateValue: delegate
            },
            identity
          )
        )
      );
      dispatch(addMessage(
        `Successfully sent origination operation ${newAccount.operationGroupID}.`,
        false
      ));

      return true;
    }

    return false;
  };
}