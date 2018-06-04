// @flow
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateButton from './CreateButton';
import SendConfirmationModal from './SendConfirmationModal';
import {
  updatePassword,
  updateToAddress,
  updateAmount,
  updateFee,
  openSendTezosModal,
  closeSendTezosModal,
  sendConfirmation,
} from '../reducers/sendTezos.duck';

import styles from './Send.css';

type Props = {
  updatePassword: Function,
  updateToAddress: Function,
  updateAmount: Function,
  updateFee: Function,
  openSendTezosModal: Function,
  closeSendTezosModal: Function,
  sendConfirmation: Function,
  isConfirmationModalOpen: boolean,
  isLoading: boolean,
  password: string,
  toAddress: string,
  amount: number,
  fee: number
};

class Send extends Component<Props> {
  props: Props;

  render() {
    const {
      isConfirmationModalOpen,
      isLoading,
      password,
      toAddress,
      amount,
      fee,
      updateToAddress,
      updateAmount,
      updatePassword,
      updateFee,
      openSendTezosModal,
      closeSendTezosModal,
      sendConfirmation,
    } = this.props;

    return (
      <div className={styles.sendContainer}>
        <TextField
          floatingLabelText="Address"
          style={{ width: '100%' }}
          value={toAddress}
          onChange={(_, newAddress) => updateToAddress(newAddress)}
        />
        <div className={styles.amountContainer}>
          <TextField
            floatingLabelText="Amount"
            style={{ width: '50%', marginRight: '50px' }}
            value={amount}
            onChange={(_, newAmount) => updateAmount(newAmount)}
          />
          <SelectField
            value={fee}
            onChange={(_, index, newFee) => updateFee(newFee)}
            style={{ width: '50%' }}
          >
            <MenuItem value={0} primaryText="Low Fee: 0000" />
            <MenuItem value={1} primaryText="Medium Fee: 0000" />
            <MenuItem value={2} primaryText="High Fee: 0000" />
            <MenuItem value={3} primaryText="Custom" />
          </SelectField>
        </div>
        <CreateButton
          label="Send"
          style={{
            border: '2px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
          onClick={openSendTezosModal}
        />
        <SendConfirmationModal
          amount={amount}
          address={toAddress}
          open={isConfirmationModalOpen}
          onCloseClick={closeSendTezosModal}
          isLoading={isLoading}
          updatePassword={updatePassword}
          password={password}
          sendConfirmation={sendConfirmation}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { sendTezos } = state;

  return {
    isConfirmationModalOpen: sendTezos.get('isConfirmationModalOpen'),
    isLoading: sendTezos.get('isLoading'),
    password: sendTezos.get('password'),
    toAddress: sendTezos.get('toAddress'),
    amount: sendTezos.get('amount'),
    fee: sendTezos.get('fee'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePassword,
    updateToAddress,
    updateAmount,
    updateFee,
    openSendTezosModal,
    closeSendTezosModal,
    sendConfirmation,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
