import {
  ConseilQueryBuilder,
  ConseilOperator,
  ConseilDataClient,
  ConseilSortDirection
} from 'conseiljs';
import { fetchAverageFees } from '../utils/general';
import { getSelectedNode } from '../utils/nodes';
import { CONSEIL } from '../constants/NodesTypes';

const { executeEntityQuery } = ConseilDataClient;

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
    const { network, platform } = settings;
    const conseilNode = getSelectedNode(settings, CONSEIL);
    const serverInfo = {
      url: conseilNode.url,
      apiKey: conseilNode.apiKey,
      network
    };

    let query = ConseilQueryBuilder.blankQuery();
    query = ConseilQueryBuilder.addFields(query, 'script');
    query = ConseilQueryBuilder.addPredicate(
      query,
      'account_id',
      ConseilOperator.EQ,
      [pkh],
      false
    );
    query = ConseilQueryBuilder.addOrdering(
      query,
      'script',
      ConseilSortDirection.DESC
    );
    query = ConseilQueryBuilder.setLimit(query, 1);

    const account = await executeEntityQuery(
      serverInfo,
      platform,
      network,
      'accounts',
      query
    ).catch(() => []);
    return account;
  };
}

export default fetchFees;
