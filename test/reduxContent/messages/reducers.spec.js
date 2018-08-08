import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import messages from '../../../app/reduxContent/message/reducers';

const initState = {
  message: {}
};

beforeEach(() => {
  jest.addMatchers(matchers);
});

describe('action type CLEAR_MESSAGE_STATE', () => {
  const expectedState = fromJS({
    ...initState
  });

  const action = {
    type: 'CLEAR_MESSAGE_STATE'
  };

  test('should return the init state', () => {
    expect(messages(undefined, action)).toEqualImmutable(expectedState);
  });
});

describe('action type ADD_MESSAGE', () => {
  const expectedState = fromJS({
    message: {
      message: 'test',
      isError: true,
      hash: 'hash'
    }
  });

  const action = {
    type: 'ADD_MESSAGE',
    message: 'test',
    isError: true,
    hash: 'hash'
  };

  test('should return correct state', () => {
    expect(messages(undefined, action)).toEqualImmutable(expectedState);
  });
});

describe('action type LOGOUT', () => {
  const expectedState = fromJS({
    ...initState
  });

  const action = {
    type: 'CLEAR_MESSAGE_STATE'
  };

  test('should return correct state', () => {
    expect(messages(undefined, action)).toEqualImmutable(expectedState);
  });
});
