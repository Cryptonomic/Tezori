import { fetchAverageFees } from '../utils/general';

const fetchFees = operationKind => {
  return async (dispatch, state) => {
    const settings = state().settings.toJS();
    const averageFees = await fetchAverageFees(settings, operationKind);
    return averageFees;
  };
};

export default fetchFees;
