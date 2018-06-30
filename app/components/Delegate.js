// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../styles/helpers';
import Button from './Button';
import { utezToTez } from '../utils/currancy';

import Loader from './Loader';
import tezosLogo from '../../resources/tezosLogo.png';
import {
  updatePassword,
  updateAddress,
  showConfirmationModal,
  closeConfirmationModal,
  sendConfirmation,
} from '../reducers/delegate.duck';

import styles from './Delegate.css';

type Props = {};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const UpdateButton = styled(Button)`
  margin: ${ms(2)} 0 0 0;
`;

class Delegate extends Component<Props> {
  props: Props;

  onModalClose = () => {
    this.props.updatePassword('');
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
      isLoading
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
            <div className={styles.feeText}>Fee: </div>
            {utezToTez(delegateFee)}
            <img src={tezosLogo} className={styles.tezosSymbol} />
          </div>
          <div className={styles.confirmationContainer}>
            <TextField
              floatingLabelText="Enter Password"
              style={{ width: '50%' }}
              type="password"
              value={password}
              onChange={(_, newPassword) => updatePassword(newPassword)}
            />

            <Button
              buttonTheme="primary"
              disabled={isLoading}
              small
              onClick={sendConfirmation}
            >
              Confirm
            </Button>
          </div>
          {isLoading && <Loader />}
        </div>
      </Dialog>
    );
  };

  render() {
    const { isReady, address, showConfirmationModal, updateAddress } = this.props;

    return (
      <Container>
        <TextField
          floatingLabelText="Delegate Address"
          value={address}
          style={{minWidth: 340, width: 'auto'}}
          onChange={(_, newAddress) => updateAddress(newAddress)}
        />

        <UpdateButton
          disabled={ !isReady }
          onClick={showConfirmationModal}
          buttonTheme="secondary"
          small
        >
          Update
        </UpdateButton>

        {this.renderWarningModal()}
      </Container>
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
    delegateFee: delegate.get('delegateFee')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updatePassword,
      updateAddress,
      showConfirmationModal,
      closeConfirmationModal,
      sendConfirmation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Delegate);
