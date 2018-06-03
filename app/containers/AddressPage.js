// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './AddressPage.css';

import Addresses from '../components/Addresses';
import ActionPanel from '../components/ActionPanel';
import AddAddressModal from '../components/AddAddressModal';
import {
  setActiveTab as setActiveAddAddressTab,
  openAddAddressModal,
  closeAddAddressModal,
  importAddress,
  updatePrivateKey,
  updatePublicKey,
  updateUsername,
  updatePassPhrase,
  updateSeed
} from '../reducers/addAddress.duck';

type Props = {
  activeTabAddAddressTab: string,
  addAddressModalIsOpen: boolean,
  setActiveAddAddressTab: Function,
  openAddAddressModal: Function,
  closeAddAddressModal: Function,
  importAddress: Function,
  seed: string,
  username: string,
  passPhrase: string,
  privateKey: string,
  publicKey: string,
  isAddAddressLoading: boolean,
  updatePrivateKey: Function,
  updatePublicKey: Function,
  updateUsername: Function,
  updatePassPhrase: Function,
  updateSeed: Function
};

class AddressPage extends Component<Props> {
  props: Props;

  render() {
    const {
      activeTabAddAddressTab,
      addAddressModalIsOpen,
      setActiveAddAddressTab,
      openAddAddressModal,
      closeAddAddressModal,
      importAddress,
      seed,
      username,
      passPhrase,
      privateKey,
      publicKey,
      isAddAddressLoading,
      updatePrivateKey,
      updatePublicKey,
      updateUsername,
      updatePassPhrase,
      updateSeed
    } = this.props;

    return (
      <div className={styles.addressPageContainer}>
        <Addresses openAddAddressModal={openAddAddressModal} />
        <ActionPanel />
        <AddAddressModal
          open={addAddressModalIsOpen}
          setActiveTab={setActiveAddAddressTab}
          closeModal={closeAddAddressModal}
          activeTab={activeTabAddAddressTab}
          importAddress={importAddress}
          seed={seed}
          username={username}
          passPhrase={passPhrase}
          privateKey={privateKey}
          publicKey={publicKey}
          isLoading={isAddAddressLoading}
          updatePrivateKey={updatePrivateKey}
          updatePublicKey={updatePublicKey}
          updateUsername={updateUsername}
          updatePassPhrase={updatePassPhrase}
          updateSeed={updateSeed}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { addAddress } = state;

  return {
    activeTabAddAddressTab: addAddress.get('activeTab'),
    addAddressModalIsOpen: addAddress.get('open'),
    seed: addAddress.get('seed'),
    username: addAddress.get('username'),
    passPhrase: addAddress.get('passPhrase'),
    privateKey: addAddress.get('privateKey'),
    publicKey: addAddress.get('publicKey'),
    isAddAddressLoading: addAddress.get('isLoading')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveAddAddressTab,
      openAddAddressModal,
      closeAddAddressModal,
      importAddress,
      updatePrivateKey,
      updatePublicKey,
      updateUsername,
      updatePassPhrase,
      updateSeed
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage);
