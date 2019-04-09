import { createSelector } from 'reselect';

export const getMessage = state => state.message;

export const getNewVersion = createSelector(
  getMessage,
  message => message.get('newVersion')
);
