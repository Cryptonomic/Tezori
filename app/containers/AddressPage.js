// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../styles/helpers';

import Addresses from '../components/Addresses';
import ActionPanel from '../components/ActionPanel';
import AddAddressModal from '../components/AddAddressModal';
import MessageBar from '../components/MessageBar';
import {
  clearAccountRefreshInterval,
  setActiveTab as setActiveAddAddressTab,
  closeAddAddressModal,
  importAddress,
  updatePrivateKey,
  updatePublicKey,
  updateUsername,
  updatePassPhrase,
  confirmPassPhrase,
  passPhrase,
  updateSeed,
  updatePkh,
  updateActivationCode,
  selectDefaultAccountOrOpenModal
} from '../reducers/address.duck';

type Props = {
  activeTabAddAddressTab: string,
  addAddressModalIsOpen: boolean,
  setActiveAddAddressTab: Function,
  closeAddAddressModal: Function,
  importAddress: Function,
  seed: string,
  pkh: string,
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
  updatePkh: Function,
  updateActivationCode: Function,
  confirmPassPhrase: Function,
  selectedAccountHash: string,
  selectDefaultAccountOrOpenModal: Function,
  message: Object
};

const Container = styled.div`
  display: flex;
  padding: ${ms(3)} ${ms(4)};
`;

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
      pkh,
      activationCode,
      username,
      passPhrase,
      privateKey,
      publicKey,
      isAddAddressLoading,
      updatePrivateKey,
      updatePublicKey,
      updateUsername,
      updatePassPhrase,
      confirmPassPhrase,
      updateSeed,
      updatePkh,
      updateActivationCode,
      selectedAccountHash,
      message
    } = this.props;

    return (
      <Container>
        <Addresses />
        <ActionPanel />
        <AddAddressModal
          open={addAddressModalIsOpen}
          setActiveTab={setActiveAddAddressTab}
          closeModal={closeAddAddressModal}
          activeTab={activeTabAddAddressTab}
          importAddress={importAddress}
          seed={seed}
          pkh={pkh}
          activationCode={activationCode}
          username={username}
          passPhrase={passPhrase}
          privateKey={privateKey}
          publicKey={publicKey}
          isLoading={isAddAddressLoading}
          updatePrivateKey={updatePrivateKey}
          updatePublicKey={updatePublicKey}
          updateUsername={updateUsername}
          updatePassPhrase={updatePassPhrase}
          confirmPassPhrase={confirmPassPhrase}
          updateSeed={updateSeed}
          updatePkh={updatePkh}
          updateActivationCode={updateActivationCode}
          selectedAccountHash={selectedAccountHash}
        />
        <MessageBar message={message} />
      </Container>
    );
  }
}

function mapStateToProps({ address, message }) {
  return {
    activeTabAddAddressTab: address.get('activeTab'),
    addAddressModalIsOpen: address.get('open'),
    message: message.get('message'),
    seed: address.get('seed'),
    pkh: address.get('pkh'),
    activationCode: address.get('activationCode'),
    username: address.get('username'),
    passPhrase: address.get('passPhrase'),
    privateKey: address.get('privateKey'),
    publicKey: address.get('publicKey'),
    isAddAddressLoading: address.get('isLoading'),
    selectedAccountHash: address.get('selectedAccountHash')
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
      updatePkh,
      updateActivationCode,
      selectDefaultAccountOrOpenModal
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage);
