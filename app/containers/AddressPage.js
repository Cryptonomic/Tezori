// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './AddressPage.css';

import Addresses from '../components/Addresses';
import ActionPanel from '../components/ActionPanel';
import AddAddressModal from '../components/AddAddressModal';
import MessageBar from '../components/MessageBar';
import {
  setActiveTab as setActiveAddAddressTab,
  closeAddAddressModal,
  importAddress,
  updatePrivateKey,
  updatePublicKey,
  updateUsername,
  updatePassPhrase,
  confirmPassPhrase,
  updateSeed,
  selectDefaultAccountOrOpenModal,
} from '../reducers/address.duck';

type Props = {
  activeTabAddAddressTab: string,
  addAddressModalIsOpen: boolean,
  setActiveAddAddressTab: Function,
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
  updateSeed: Function,
  confirmPassPhrase: Function,
  selectedAccountHash: string,
  selectDefaultAccountOrOpenModal: Function,
  message: Object
};

class AddressPage extends Component<Props> {
  props: Props;

  componentDidMount() {
    this.props.selectDefaultAccountOrOpenModal();
  }

  render() {
    const {
      activeTabAddAddressTab,
      addAddressModalIsOpen,
      setActiveAddAddressTab,
      closeAddAddressModal,
      importAddress,
      seed,
      username,
      passPhrase,
      isFormValid,
      privateKey,
      publicKey,
      isAddAddressLoading,
      updatePrivateKey,
      updatePublicKey,
      updateUsername,
      updatePassPhrase,
      confirmPassPhrase,
      updateSeed,
      selectedAccountHash,
      message,
    } = this.props;

    return (
      <div className={styles.addressPageContainer}>
        <Addresses />
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
          isFormValid={isFormValid}
          updatePrivateKey={updatePrivateKey}
          updatePublicKey={updatePublicKey}
          updateUsername={updateUsername}
          updatePassPhrase={updatePassPhrase}
          confirmPassPhrase={confirmPassPhrase}
          updateSeed={updateSeed}
          selectedAccountHash={selectedAccountHash}
        />
        <MessageBar message={message} />
      </div>
    );
  }
}

function mapStateToProps({ address, message }) {
  return {
    activeTabAddAddressTab: address.get('activeTab'),
    addAddressModalIsOpen: address.get('open'),
    message: message.get('message'),
    seed: address.get('seed'),
    username: address.get('username'),
    isFormValid: address.get('isFormValid'),
    passPhrase: address.get('passPhrase'),
    privateKey: address.get('privateKey'),
    publicKey: address.get('publicKey'),
    isAddAddressLoading: address.get('isLoading'),
    selectedAccountHash: address.get('selectedAccountHash'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveAddAddressTab,
      closeAddAddressModal,
      importAddress,
      updatePrivateKey,
      updatePublicKey,
      updateUsername,
      updatePassPhrase,
      confirmPassPhrase,
      updateSeed,
      selectDefaultAccountOrOpenModal,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage);
