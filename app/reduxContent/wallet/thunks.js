import path from 'path';
import { push } from 'react-router-redux';
import { TezosWallet, TezosConseilQuery, TezosOperations } from 'conseiljs';
import { addMessage } from '../../reduxContent/message/thunks';
import { CREATE, IMPORT } from '../../constants/CreationTypes';
import { FUNDRAISER, GENERATE_MNEMONIC, RESTORE } from '../../constants/AddAddressTypes';
import { CONSEIL, TEZOS } from '../../constants/NodesTypes';
import { CREATED } from '../../constants/StatusTypes';
import * as storeTypes from '../../constants/StoreTypes';

import { findAccountIndex, getSyncAccount } from '../../utils/account';

import {
  findIdentity,
  findIdentityIndex,
  createIdentity,
  getSyncIdentity
} from '../../utils/identity';

import { clearOperationId } from '../../utils/general';

import { saveUpdatedWallet } from '../../utils/wallet';

import {
  logout,
  setWallet,
  setIsLoading,
  setIdentities,
  addNewIdentity,
  updateIdentity,
  updateFetchedTime
} from './actions';

import { getSelectedNode } from '../../utils/nodes';

const {
  unlockFundraiserIdentity,
  unlockIdentityWithMnemonic,
  createWallet,
  loadWallet
} = TezosWallet;

const { getAccount } = TezosConseilQuery;

const { sendIdentityActivationOperation } = TezosOperations;
let currentAccountRefreshInterval = null;

export function goHomeAndClearState() {
  return dispatch => {
    dispatch(logout());
    clearAutomaticAccountRefresh();
    dispatch(push('/'));
  };
}

export function automaticAccountRefresh() {
  return dispatch => {
    const oneSecond = 1000; // milliseconds
    const oneMinute = 60 * oneSecond;
    const minutes = 1;
    const REFRESH_INTERVAL = minutes * oneMinute;

    if (currentAccountRefreshInterval) {
      clearAutomaticAccountRefresh();
    }

    currentAccountRefreshInterval = setInterval(
      () => dispatch(syncWallet()),
      REFRESH_INTERVAL
    );
  };
}

export function clearAutomaticAccountRefresh() {
  clearInterval(currentAccountRefreshInterval);
}

export function updateAccountActiveTab(
  selectedAccountHash,
  selectedParentHash,
  activeTab
) {
  return async (dispatch, state) => {
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const identity = findIdentity(identities, selectedParentHash);
    const foundIndex = findAccountIndex(identity, selectedAccountHash);
    const account = identity.accounts[foundIndex];

    if (foundIndex > -1) {
      identity.accounts[foundIndex] = {
        ...account,
        activeTab
      };

      dispatch(updateIdentity(identity));
    }
  };
}

export function updateIdentityActiveTab(selectedAccountHash, activeTab) {
  return async (dispatch, state) => {
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const identity = findIdentity(identities, selectedAccountHash);
    if (identity) {
      dispatch(
        updateIdentity({
          ...identity,
          activeTab
        })
      );
    }
  };
}

export function updateActiveTab(
  selectedAccountHash,
  selectedParentHash,
  activeTab
) {
  return async dispatch => {
    if (selectedAccountHash === selectedParentHash) {
      dispatch(updateIdentityActiveTab(selectedAccountHash, activeTab));
    } else {
      dispatch(
        updateAccountActiveTab(
          selectedAccountHash,
          selectedParentHash,
          activeTab
        )
      );
    }
  };
}

export function syncAccount(selectedAccountHash, selectedParentHash) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const identity = findIdentity(identities, selectedParentHash);
    const foundIndex = findAccountIndex(identity, selectedAccountHash);
    const account = identity.accounts[foundIndex];

    if (foundIndex > -1) {
      identity.accounts[foundIndex] = await getSyncAccount(
        identities,
        account,
        nodes,
        selectedAccountHash,
        selectedParentHash
      ).catch(e => {
        console.log(
          `-debug: Error in: syncAccount for:${identity.publicKeyHash}`
        );
        console.error(e);
        return account;
      });
    }

    dispatch(updateIdentity(identity));
  };
}

export function syncIdentity(publicKeyHash) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const selectedAccountHash = state().wallet.get('selectedAccountHash');
    let identity = findIdentity(identities, publicKeyHash);

    identity = await getSyncIdentity(
      identities,
      identity,
      nodes,
      selectedAccountHash
    ).catch(e => {
      console.log(`-debug: Error in: syncIdentity for:${publicKeyHash}`);
      console.error(e);
      return identity;
    });

    dispatch(updateIdentity(identity));
  };
}

export function syncWallet() {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const nodes = state().nodes.toJS();
    let identities = state()
      .wallet.get('identities')
      .toJS();

    identities = await Promise.all(
      (identities || []).map(async identity => {
        const { publicKeyHash } = identity;
        const syncIdentity = await getSyncIdentity(
          identities,
          identity,
          nodes
        ).catch(e => {
          console.log(`-debug: Error in: syncIdentity for: ${publicKeyHash}`);
          console.error(e);
          return identity;
        });
        return syncIdentity;
      })
    );
    dispatch(setIdentities(identities));
    dispatch(updateFetchedTime(new Date()));
    dispatch(setIsLoading(false));
  };
}

export function syncAccountOrIdentity(selectedAccountHash, selectedParentHash) {
  return async dispatch => {
    try {
      dispatch(setIsLoading(true));
      if (selectedAccountHash === selectedParentHash) {
        await dispatch(syncIdentity(selectedAccountHash));
      } else {
        await dispatch(syncAccount(selectedAccountHash, selectedParentHash));
      }
    } catch (e) {
      console.log(
        `-debug: Error in: syncAccountOrIdentity for:${selectedAccountHash}`,
        selectedParentHash
      );
      console.error(e);
      dispatch(addMessage(e.name, true));
    }
    dispatch(setIsLoading(false));
  };
}

export function importAddress(
  activeTab,
  seed,
  pkh,
  activationCode,
  username,
  passPhrase
) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const { wallet } = state();
    let identities = wallet.get('identities');
    const walletLocation = wallet.get('walletLocation');
    const walletFileName = wallet.get('walletFileName');
    const password = wallet.get('password');

    // TODO: clear out message bar
    dispatch(addMessage('', true));
    dispatch(setIsLoading(true));
    try {
      let identity = null;
      switch (activeTab) {
        case GENERATE_MNEMONIC:
          identity = await unlockIdentityWithMnemonic(seed, '');
          identity.storeTypes = storeTypes.MNEMONIC;
          break;
        case FUNDRAISER: {
          identity = await unlockFundraiserIdentity(
            seed,
            username.trim(),
            passPhrase.trim(),
            pkh.trim()
          );
          identity.storeTypes = storeTypes.FUNDRAISER;
          const conseilNode = getSelectedNode(nodes, CONSEIL);

          const account = await getAccount(
            conseilNode.url,
            identity.publicKeyHash,
            conseilNode.apiKey
          ).catch(() => false);

          if (!account) {
            const tezosNode = getSelectedNode(nodes, TEZOS);
            const activating = await sendIdentityActivationOperation(
              tezosNode.url,
              identity,
              activationCode
            ).catch(err => {
              const errorObj = { name: err.message, ...err };
              throw errorObj;
            });
            const operationId = clearOperationId(activating.operationGroupID);
            dispatch(
              addMessage(
                `Successfully started account activitation.`,
                false,
                operationId
              )
            );
            identity.operations = {
              [CREATED]: operationId
            };
          }
          break;
        }
        case RESTORE:
          identity = await unlockIdentityWithMnemonic(seed, '');
          identity.storeTypes = storeTypes.RESTORE;
          break;
        default:
          break;
      }

      if (identity) {
        const { publicKeyHash } = identity;
        if (findIdentityIndex(identities.toJS(), publicKeyHash) === -1) {
          identity = createIdentity(identity);
          dispatch(addNewIdentity(identity));
          identities = state()
            .wallet.get('identities')
            .toJS();
          await saveUpdatedWallet(
            identities,
            walletLocation,
            walletFileName,
            password
          );
          dispatch(push('/home'));
          await dispatch(syncAccountOrIdentity(publicKeyHash, publicKeyHash));
        } else {
          dispatch(addMessage('Identity already exist', true));
        }
      }
    } catch (e) {
      console.log(`-debug: Error in: importAddress for:${activeTab}`);
      console.error(e);
      dispatch(addMessage(e.name, true));
    }

    dispatch(setIsLoading(false));
  };
}

// todo: 3 on create account success add that account to file - incase someone closed wallet before ready was finish.
export function login(loginType, walletLocation, walletFileName, password) {
  return async dispatch => {
    dispatch(setIsLoading(true));
    const completeWalletPath = path.join(walletLocation, walletFileName);
    dispatch(addMessage('', true));
    try {
      let wallet = {};
      if (loginType === CREATE) {
        wallet = await createWallet(completeWalletPath, password);
      } else if (loginType === IMPORT) {
        wallet = await loadWallet(completeWalletPath, password).catch(err => {
          const errorObj = {
            name: 'Invalid wallet/password combination.',
            ...err
          };
          throw errorObj;
        });
      }

      const identities = wallet.identities.map(identity =>
        createIdentity(identity)
      );

      dispatch(
        setWallet(
          {
            isLoading: true,
            identities,
            walletLocation,
            walletFileName,
            password
          },
          'wallet'
        )
      );

      dispatch(automaticAccountRefresh());
      dispatch(push('/home'));
      await dispatch(syncWallet());
    } catch (e) {
      dispatch(addMessage(e.name, true));
    }
    dispatch(setIsLoading(false));
  };
}
