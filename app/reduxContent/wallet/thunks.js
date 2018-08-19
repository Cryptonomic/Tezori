import path from 'path';
import { push } from 'react-router-redux';
import { TezosWallet, TezosConseilQuery, TezosOperations } from 'conseiljs';
import { addMessage } from '../../reduxContent/message/thunks';
import { CREATE, IMPORT } from '../../constants/CreationTypes';
import { FUNDRAISER, GENERATE_MNEMONIC, RESTORE } from '../../constants/AddAddressTypes';
import { CONSEIL, TEZOS } from '../../constants/NodesTypes';
import { CREATED } from '../../constants/StatusTypes';
import * as storeTypes from '../../constants/StoreTypes';

import {
  findAccountIndex,
  getSyncAccount,
  syncAccountWithState
} from '../../utils/account';

import {
  findIdentity,
  findIdentityIndex,
  createIdentity,
  getSyncIdentity,
  syncIdentityWithState
} from '../../utils/identity';

import { clearOperationId, getNodesStatus, getNodesError } from '../../utils/general';
import { saveUpdatedWallet, loadPersistedState, persistWalletState } from '../../utils/wallet';

import {
  logout,
  setWallet,
  setIsLoading,
  setIdentities,
  setNodesStatus,
  addNewIdentity,
  updateIdentity,
  updateFetchedTime,
  updateTempIdentity
} from './actions';

import { getSelectedNode } from '../../utils/nodes';

// const {
//   unlockFundraiserIdentity,
//   unlockIdentityWithMnemonic,
//   createWallet
// } = TezosWallet;

const {
  unlockIdentityWithMnemonic,
  createWallet
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
    let identities = state()
      .wallet.get('identities')
      .toJS();
    let identity = findIdentity(identities, selectedParentHash);
    const foundIndex = findAccountIndex(identity, selectedAccountHash);
    let syncAccount = identity.accounts[foundIndex];

    if (foundIndex > -1) {
      syncAccount = await getSyncAccount(
        identities,
        syncAccount,
        nodes,
        selectedAccountHash,
        selectedParentHash
      ).catch(e => {
        console.log(
          `-debug: Error in: syncAccount for:${identity.publicKeyHash}`
        );
        console.error(e);
        return syncAccount;
      });
    }

    identities = state()
      .wallet.get('identities')
      .toJS();
    identity = findIdentity(identities, selectedParentHash);
    identity.accounts[foundIndex] = syncAccountWithState(
      syncAccount,
      identity.accounts[foundIndex]
    );
    dispatch(updateIdentity(identity));
    await persistWalletState(state().wallet.toJS());
  };
}

export function syncIdentity(publicKeyHash) {
  return async (dispatch, state) => {
    const nodes = state().nodes.toJS();
    const identities = state()
      .wallet.get('identities')
      .toJS();
    const selectedAccountHash = state().wallet.get('selectedAccountHash');
    let stateIdentity = findIdentity(identities, publicKeyHash);

    const syncIdentity = await getSyncIdentity(
      identities,
      stateIdentity,
      nodes,
      selectedAccountHash
    ).catch(e => {
      console.log(`-debug: Error in: syncIdentity for:${publicKeyHash}`);
      console.error(e);
      return stateIdentity;
    });

    stateIdentity = findIdentity(
      state().wallet.get('identities').toJS(),
      publicKeyHash
    );

    dispatch(updateIdentity(
      syncIdentityWithState(syncIdentity, stateIdentity)
    ));
    await persistWalletState(state().wallet.toJS());
  };
}

export function syncWallet() {
  return async (dispatch, state) => {
    dispatch(setIsLoading(true));
    const nodes = state().nodes.toJS();

    const nodesStatus = await getNodesStatus(nodes);
    dispatch(setNodesStatus(nodesStatus));
    const res = getNodesError(nodesStatus);
    console.log('-debug: res, nodesStatus', res, nodesStatus);

    if ( getNodesError(nodesStatus) ) {
      dispatch(setIsLoading(false));
      return false;
    }


    let stateIdentities = state()
      .wallet.get('identities')
      .toJS();

    const syncIdentities = await Promise.all(
      (stateIdentities || []).map(async identity => {
        const { publicKeyHash } = identity;
        const syncIdentity = await getSyncIdentity(
          stateIdentities,
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

    stateIdentities = state()
      .wallet.get('identities')
      .toJS();
    
    const newIdentities = stateIdentities
      .filter(stateIdentity => {
        const syncIdentityIndex = syncIdentities
          .findIndex(syncIdentity =>
            stateIdentity.publicKeyHash === syncIdentity.publicKeyHash
          );

        if ( syncIdentityIndex > -1 ) {
          syncIdentities[syncIdentityIndex] = syncIdentityWithState(
            syncIdentities[syncIdentityIndex],
            stateIdentity
          );
          return false;
        }
        
        return true;
    });
    
    dispatch(setIdentities(
      syncIdentities.concat(newIdentities)
    ));
    dispatch(updateFetchedTime(new Date()));
    await persistWalletState(state().wallet.toJS());
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

export function gotoHome() {
  return async (dispatch) => {
    dispatch(push('/home'));
  }
}

export function importAddress(
  activeTab,
  seed,
  pkh,
  activationCode,
  username,
  passPhrase,
  isCheck = false
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
          identity.storeType = storeTypes.MNEMONIC;
          break;
        case FUNDRAISER: {
          const newPassPhrase = username.trim() + passPhrase.trim();
          identity = await unlockIdentityWithMnemonic(
            seed,
            newPassPhrase
          );
          
          identity.storeType = storeTypes.FUNDRAISER;
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
              const error = err;
              error.name = err.message;
              throw error;
            });
            const operationId = clearOperationId(activating.operationGroupID);
            dispatch(
              addMessage(
                `Successfully started account activation.`,
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
        {
          identity = await unlockIdentityWithMnemonic(seed, passPhrase);
          const storeTypesMap = {
            0:  storeTypes.MNEMONIC,
            1:  storeTypes.FUNDRAISER
          };
          identity.storeType = storeTypesMap[ identity.storeType ];
          const conseilNode = getSelectedNode(nodes, CONSEIL);

          const account = await getAccount(
            conseilNode.url,
            identity.publicKeyHash,
            conseilNode.apiKey
          ).catch(() => false);
          
          if (!account) {
            const title = 'The account does not exist.';
            const err = new Error(title);
            err.name = title;
            throw err;
          }
          break;
        }
        default:
          break;
      }

      if (identity) {
        const { publicKeyHash } = identity;
        const jsIdentities = identities.toJS();
        if (findIdentityIndex(jsIdentities, publicKeyHash) === -1) {
          delete identity.seed;
          identity.order = jsIdentities.length + 1;
          
          identity = createIdentity(identity);
          if(isCheck) {
            dispatch(updateTempIdentity(identity));
          } else {
            dispatch(addNewIdentity(identity));
          }
          
          identities = state()
            .wallet.get('identities')
            .toJS();
          await saveUpdatedWallet(
            identities,
            walletLocation,
            walletFileName,
            password
          );
          await persistWalletState(state().wallet.toJS());
          if(!isCheck) {
            dispatch(push('/home'));
          }          
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
        wallet = await loadPersistedState(completeWalletPath, password);
      }

      const identities = wallet.identities
        .map((identity, identityIndex) => {
          return createIdentity({
            ...identity,
            order: identity.order || (identityIndex + 1)
          });
        });
      
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
      console.error(e);
      dispatch(addMessage(e.name, true));
    }
    dispatch(setIsLoading(false));
  };
}
