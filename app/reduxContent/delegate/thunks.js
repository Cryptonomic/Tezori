import { TezosOperations } from 'conseiljs';
import { addMessage } from '../../reduxContent/message/thunks';
import { updateIdentity } from '../../reduxContent/wallet/actions';
import { displayError } from '../../utils/formValidation';
import { getSelectedNode } from '../../utils/nodes';
import { findIdentity } from '../../utils/identity';
import { findAccountIndex } from '../../utils/account';
import { TEZOS } from '../../constants/NodesTypes';
import {
  getSelectedKeyStore,
  fetchAverageFees,
  clearOperationId
} from '../../utils/general'

const {
  sendDelegationOperation
} = TezosOperations;

export function fetchDelegationAverageFees() {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    return await fetchAverageFees(nodes, 'delegation');
  }
}

export function validateAddress(address) {
  return async (dispatch, state) => {
    const validations = [
      { value: address, type: 'notEmpty', name: 'Address' },
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

export function delegate( delegateValue, fee, password, selectedAccountHash, selectedParentHash ) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state().wallet.get('identities').toJS();
    const walletPassword = state().wallet.get('password');

    if ( password !== walletPassword ) {
      const error = 'Incorrect password';
      dispatch(addMessage(error, true));
      return false;
    }

    const keyStore = getSelectedKeyStore(identities, selectedAccountHash, selectedParentHash);
    const { url, apiKey } = getSelectedNode(nodes, TEZOS);
    const res = await sendDelegationOperation(url, keyStore, delegateValue, fee).catch((err) => {
      err.name = err.message;
      console.error(err);
      dispatch(addMessage(err.name, true));
      return false;
    });

    if ( res ) {
      dispatch(addMessage(
        `Successfully started delegation update.`,
        false,
        clearOperationId(res.operationGroupID)
      ));

      const identity = findIdentity(identities, selectedParentHash);
      const foundIndex = findAccountIndex( identity, selectedAccountHash );
      const account = identity.accounts[ foundIndex ];

      if ( foundIndex > -1 ) {
        identity.accounts[ foundIndex ] = {
          ...account,
          delegateValue: ''
        };

        dispatch(updateIdentity(identity));
      }

      return true;
    }
    return false;
  }
}