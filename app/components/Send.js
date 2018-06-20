// @flow
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

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

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
`

const AmountContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

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
  amount: string,
  fee: number
};

class Send extends Component<Props> {
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
      <SendContainer>
        <TextField
          floatingLabelText="Address"
          style={{ width: '100%' }}
          value={toAddress}
          onChange={(_, newAddress) => updateToAddress(newAddress)}
        />
        <AmountContainer>
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
            <MenuItem value={100} primaryText="Low Fee: 100" />
            <MenuItem value={200} primaryText="Medium Fee: 200" />
            <MenuItem value={400} primaryText="High Fee: 400" />
            <MenuItem value={500} primaryText="Custom" />
          </SelectField>
        </AmountContainer>
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
      </SendContainer>
    );
  }
}

const  mapStateToProps = state => {
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

const mapDispatchToProps = dispatch =>
  bindActionCreators({
      updatePassword,
      updateToAddress,
      updateAmount,
      updateFee,
      openSendTezosModal,
      closeSendTezosModal,
      sendConfirmation,
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Send);
