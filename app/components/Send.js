// @flow
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from './Button';
import { utezToTez } from '../utils/currancy';
import { ms } from '../styles/helpers'
import SendConfirmationModal from './SendConfirmationModal';
import {
  updatePassword,
  updateToAddress,
  updateAmount,
  updateFee,
  showConfirmation,
  closeSendTezosModal,
  sendConfirmation
} from '../reducers/sendTezos.duck';

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const SendButton = styled(Button)`
  margin-top: ${ms(2)}
`

type Props = {
  isReady: boolean,
  updatePassword: Function,
  updateToAddress: Function,
  updateAmount: Function,
  updateFee: Function,
  showConfirmation: Function,
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
      isReady,
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
      showConfirmation,
      closeSendTezosModal,
      sendConfirmation
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
            <MenuItem value={100} primaryText={ `Low Fee: ${ utezToTez(100)} ` } />
            <MenuItem value={200} primaryText={ `Medium Fee: ${ utezToTez(200)}` } />
            <MenuItem value={400} primaryText={ `High Fee: ${ utezToTez(400)}` } />
            <MenuItem value={500} primaryText="Custom" />
          </SelectField>
        </AmountContainer>
        <SendButton
          disabled={ !isReady }
          onClick={showConfirmation}
          buttonTheme="secondary"
          small
        >
          Send
        </SendButton>
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

const mapStateToProps = state => {
  const { sendTezos } = state;

  return {
    isConfirmationModalOpen: sendTezos.get('isConfirmationModalOpen'),
    isLoading: sendTezos.get('isLoading'),
    password: sendTezos.get('password'),
    toAddress: sendTezos.get('toAddress'),
    amount: sendTezos.get('amount'),
    fee: sendTezos.get('fee')
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePassword,
      updateToAddress,
      updateAmount,
      updateFee,
      closeSendTezosModal,
      showConfirmation,
      sendConfirmation
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Send);