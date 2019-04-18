import { TezosConseilClient } from 'conseiljs';
import { fetchAverageFees } from '../utils/general';
import { getSelectedNode } from '../utils/nodes';
import { CONSEIL } from '../constants/NodesTypes';

const { getAccount } = TezosConseilClient;

const fetchFees = operationKind => {
  return async (dispatch, state) => {
    const settings = state().settings.toJS();
    const averageFees = await fetchAverageFees(settings, operationKind);
    return averageFees;
  };
};

export function getAccountFromServer(pkh) {
  return async (dispatch, state) => {
    const settings = state().settings.toJS();
    const { network } = settings;
    const conseilNode = getSelectedNode(settings, CONSEIL);

    const account = await getAccount(
      { url: conseilNode.url, apiKey: conseilNode.apiKey },
      network,
      pkh
    ).catch(() => []);
    return account;
  };
}

export default fetchFees;
