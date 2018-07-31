import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import reducer from '../../../app/reduxContent/wallet/reducers';
import * as types from '../../../app/reduxContent/wallet/types';

const initialState = {
  identities: [],
  isLoading: false,
  walletFileName: '',
  walletLocation: '',
  password: '',
  time: new Date()
};

const initState = fromJS(initialState);

describe('wallet reducers', () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return default for unknown action', () => {
    expect(reducer(initState, {})).toEqualImmutable(initState);
  });

  it('should set the isLoading property', () => {
    const expectedState = fromJS({
      ...initialState,
      isLoading: true
    });
    const action = {
      type: types.SET_IS_LOADING,
      isLoading: true
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should set the wallet filename', () => {
    const newWalletFilename = 'test.file';
    const expectedState = fromJS({
      ...initialState,
      walletFileName: newWalletFilename
    });
    const action = {
      type: types.SET_WALLET_FILENAME,
      walletFileName: newWalletFilename
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should set the wallet location', () => {
    const newWalletLocation = 'some/path/to/a/file/wallet.file';
    const expectedState = fromJS({
      ...initialState,
      walletLocation: newWalletLocation
    });
    const action = {
      type: types.SET_WALLET_LOCATION,
      walletLocation: newWalletLocation
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should set the wallet password', () => {
    const newWalletPassword = 'S0m3Password!';
    const expectedState = fromJS({
      ...initialState,
      password: newWalletPassword
    });
    const action = {
      type: types.SET_PASSWORD,
      password: newWalletPassword
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should set the wallet from object', () => {
    const newWallet = {
      identities: [],
      isLoading: false,
      walletFileName: '',
      walletLocation: '',
      password: '',
      time: new Date()
    };
    const expectedState = fromJS(newWallet);
    const action = {
      type: types.SET_WALLET,
      wallet: newWallet
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should set the wallet identities', () => {
    const newIdentities = [
      { id: Symbol('id') },
      { id: Symbol('id') },
      { id: Symbol('id') }
    ];
    const expectedState = fromJS({
      ...initialState,
      identities: newIdentities
    });
    const action = {
      type: types.SET_IDENTITIES,
      identities: newIdentities
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });

  it('should add new identity to the wallet', () => {
    const newIdentity = { id: Symbol('id') };
    const expectedResult = fromJS(newIdentity);
    const action = {
      type: types.ADD_NEW_IDENTITY,
      identity: newIdentity
    };
    expect(reducer(initState, action).get('identities')).toContainEqual(
      expectedResult
    );
  });

  it('should return the same state when updating a non-existent identity', () => {
    const initialStateWithIdentity = fromJS({
      ...initialState,
      identities: [{ publicKeyHash: Symbol('publicKeyHash') }]
    });
    const action = {
      type: types.UPDATE_IDENTITY,
      identity: { publicKeyHash: Symbol('publicKeyHash') }
    };
    expect(reducer(initialStateWithIdentity, action)).toEqualImmutable(
      initialStateWithIdentity
    );
  });

  it('should update the correct identity', () => {
    const pubKeyHash = Symbol('publicKeyHash');
    const initialStateWithIdentity = fromJS({
      ...initialState,
      identities: [{ publicKeyHash: pubKeyHash, someField: 2 }]
    });
    const updatedIdentity = { publicKeyHash: pubKeyHash, someField: 3 };
    const expectedIdentity = fromJS(updatedIdentity);
    const action = {
      type: types.UPDATE_IDENTITY,
      identity: updatedIdentity
    };
    expect(
      reducer(initialStateWithIdentity, action)
        .get('identities')
        .find(identity => {
          return identity.get('publicKeyHash') === pubKeyHash;
        })
    ).toEqualImmutable(expectedIdentity);
  });

  it('should return the same state when updating non-existent account', () => {
    const initialStateWithIdentity = fromJS({
      ...initialState,
      identities: [{ publicKeyHash: Symbol('publicKeyHash') }]
    });
    const action = {
      type: types.ADD_NEW_ACCOUNT,
      identity: { publicKeyHash: Symbol('publicKeyHash') }
    };
    expect(reducer(initialStateWithIdentity, action)).toEqualImmutable(
      initialStateWithIdentity
    );
  });

  it('should add a new account identity', () => {
    const pubKeyHash = Symbol('publicKeyHash');
    const initialStateWithIdentity = fromJS({
      ...initialState,
      identities: [{ publicKeyHash: pubKeyHash, accounts: [] }]
    });
    const newAccount = Symbol('account');
    const action = {
      type: types.ADD_NEW_ACCOUNT,
      publicKeyHash: pubKeyHash,
      account: newAccount
    };
    const result = reducer(initialStateWithIdentity, action)
      .get('identities')
      .find(identity => {
        return identity.get('publicKeyHash') === pubKeyHash;
      })
      .get('accounts');
    expect(result).toBeImmutableList();
    expect(result.includes(newAccount)).toBe(true);
  });

  it('should update fetched time', () => {
    const newFetchedTime = new Date();
    const expectedState = fromJS({
      ...initialState,
      time: newFetchedTime
    });
    const action = {
      type: types.UPDATE_FETCHED_TIME,
      time: newFetchedTime
    };
    expect(reducer(initState, action)).toEqualImmutable(expectedState);
  });
});
