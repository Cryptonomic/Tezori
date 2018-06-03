// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateButton from './CreateButton';
import Loader from './Loader';
import tezosLogo from '../../resources/tezosLogo.png';
import {
  updatePassword,
  updateAddress,
  openConfirmationModal,
  closeConfirmationModal,
  sendConfirmation,
  setOriginalAddress,
} from '../reducers/delegate.duck';

import styles from './Delegate.css';

type Props = {}

class Delegate extends Component<Props> {
  props: Props;

  componentDidMount() {
    this.props.setOriginalAddress();
  }

  onModalClose = () => {
    this.props.updatePassword('');
    this.props.setOriginalAddress();
    this.props.closeConfirmationModal();
  };

  renderWarningModal = () => {
    const {
      address,
      delegateFee,
      password,
      updatePassword,
      sendConfirmation,
      isConfirmationModalOpen,
      isLoading,
    } = this.props;

    return (
      <Dialog
        modal
        open={isConfirmationModalOpen}
        title="Confirm Delegate Change"
        contentStyle={{ width: '600px' }}
      >
        <div>
          <CloseIcon
            className={styles.closeIcon}
            style={{ fill: '#7190C6' }}
            onClick={this.onModalClose}
          />
          <div>Are you sure you want to change your delegate to:</div>
          <div className={styles.modalAddress}>{address}</div>
          <div className={styles.feeContainer}>
            <div className={styles.feeText}>Fee: </div>{delegateFee}
            <img
              src={tezosLogo}
              className={styles.tezosSymbol}
            />
          </div>
          <div className={styles.confirmationContainer}>
            <TextField
              floatingLabelText="Enter Password"
              style={{ width: '50%' }}
              type="password"
              value={password}
              onChange={(_, newPassword) => updatePassword(newPassword)}
            />
            <CreateButton
              label="Confirm"
              style={{
                border: '2px solid #7B91C0',
                color: '#7B91C0',
                height: '28px',
                fontSize: '15px',
                marginTop: '15px',
              }}
              disabled={isLoading}
              onClick={sendConfirmation}
            />
          </div>
          {isLoading && <Loader />}
        </div>
      </Dialog>
    );
  };

  render() {
    const { address, openConfirmationModal, updateAddress } = this.props;

    return (
      <div className={styles.delegateContainer}>
        <TextField
          floatingLabelText="New Address"
          value={address}
          onChange={(_, newAddress) => updateAddress(newAddress)}
        />
        <CreateButton
          label="Update"
          style={{
            border: '2px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
          onClick={openConfirmationModal}
        />
        {this.renderWarningModal()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { delegate } = state;

  return {
    isConfirmationModalOpen: delegate.get('isConfirmationModalOpen'),
    isLoading: delegate.get('isLoading'),
    password: delegate.get('password'),
    address: delegate.get('address'),
    delegateFee: delegate.get('delegateFee'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePassword,
    updateAddress,
    openConfirmationModal,
    closeConfirmationModal,
    sendConfirmation,
    setOriginalAddress,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Delegate);
