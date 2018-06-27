import React from 'react';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import classNames from 'classnames';

import Button from './Button';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import Loader from './Loader';

import styles from './AddAddressModal.css';

type Props = {
  open: boolean,
  activeTab: string,
  closeModal: Function,
  setActiveTab: Function,
  importAddress: Function,
  seed: string,
  activationCode: string,
  username: string,
  passPhrase: string,
  privateKey: string,
  publicKey: string,
  isLoading: boolean,
  updatePrivateKey: Function,
  updatePublicKey: Function,
  updateUsername: Function,
  updatePassPhrase: Function,
  confirmPassPhrase: Function,
  updateSeed: Function,
  updateActivationCode: Function,
  selectedAccountHash: string
};

export default function AddAddress(props: Props) {
  const {
    open,
    activeTab,
    closeModal,
    setActiveTab,
    importAddress,
    seed,
    activationCode,
    updateActivationCode,
    username,
    passPhrase,
    privateKey,
    publicKey,
    isLoading,
    updatePrivateKey,
    updatePublicKey,
    updateUsername,
    updatePassPhrase,
    confirmPassPhrase,
    updateSeed,
    selectedAccountHash
  } = props;

  function renderAppBar() {
    return (
      <div className={styles.titleContainer}>
        <div>Add an Address</div>
        {selectedAccountHash && (
          <CloseIcon
            className={styles.closeIcon}
            style={{ fill: 'white' }}
            onClick={closeModal}
          />
        )}
      </div>
    );
  }

  function renderTab(tabName) {
    const tabClasses = classNames({
      [styles.tab]: true,
      [styles.inactiveTab]: tabName !== activeTab,
      [styles.activeTab]: tabName === activeTab
    });

    return (
      <div
        key={tabName}
        className={tabClasses}
        onClick={() => setActiveTab(tabName)}
      >
        {tabName}
      </div>
    );
  }

  function renderTabController() {
    return (
      <div className={styles.tabContainer}>
        {Object.values(ADD_ADDRESS_TYPES).map(renderTab)}
      </div>
    );
  }

  function renderAddBody() {
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.PRIVATE_KEY:
        return (
          <div className={styles.addAddressTypeBody}>
            <TextField
              floatingLabelText="Private Key"
              style={{ width: '100%' }}
              value={privateKey}
              onChange={(_, newPrivateKey) => updatePrivateKey(newPrivateKey)}
            />
            <TextField
              floatingLabelText="Public Key"
              style={{ width: '100%' }}
              value={publicKey}
              onChange={(_, newPublicKey) => updatePublicKey(newPublicKey)}
            />
          </div>
        );
      case ADD_ADDRESS_TYPES.SEED_PHRASE:
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return (
          <div>
            <TextField
              floatingLabelText="Seed Words"
              style={{ width: '100%' }}
              value={seed}
              disabled={activeTab === ADD_ADDRESS_TYPES.GENERATE_MNEMONIC}
              onChange={(_, newSeed) => updateSeed(newSeed)}
            />
            <div className={styles.fundraiserPasswordContainer}>
              <TextField
                floatingLabelText="Passphrase"
                type="password"
                style={{ width: '45%' }}
                value={passPhrase}
                onChange={(_, newPassPhrase) => updatePassPhrase(newPassPhrase)}
              />
              <TextField
                floatingLabelText="Confirm Passphrase"
                type="password"
                style={{ width: '45%' }}
                onChange={(_, newPassPhrase) =>
                  confirmPassPhrase(newPassPhrase)
                }
              />
            </div>
          </div>
        );
      case ADD_ADDRESS_TYPES.FUNDRAISER:
      default:
        return (
          <div className={styles.addAddressTypeBody}>
            <TextField
              floatingLabelText="Seed Words"
              style={{ width: '100%' }}
              value={seed}
              onChange={(_, newSeed) => updateSeed(newSeed)}
            />
            <TextField
              floatingLabelText="Activation Code"
              style={{ width: '100%' }}
              value={activationCode}
              onChange={(_, newActivationCode) => updateActivationCode(newActivationCode)}
            />
            <TextField
              floatingLabelText="Email"
              style={{ width: '100%' }}
              value={username}
              onChange={(_, newUsername) => updateUsername(newUsername)}
            />
            <TextField
              floatingLabelText="Password"
              type="password"
              style={{ width: '100%' }}
              value={passPhrase}
              onChange={(_, newPassPhrase) => updatePassPhrase(newPassPhrase)}
            />
          </div>
        );
    }
  }

  return (
    <Dialog modal open={open} bodyStyle={{ padding: '0px' }}>
      {renderAppBar()}
      {renderTabController()}
      <div className={styles.addAddressBodyContainer}>
        {renderAddBody()}
        <div>
          <Button
            buttonTheme="primary"
            onClick={importAddress}
            disabled={isLoading}
            small
          >
            Import
          </Button>
          {isLoading && <Loader />}
        </div>
      </div>
    </Dialog>
  );
}
