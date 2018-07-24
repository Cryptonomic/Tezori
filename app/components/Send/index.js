// @flow
import React, { Component } from 'react';
import { TextField } from 'material-ui';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '../Button/';
import { ms } from '../../styles/helpers';
import SendConfirmationModal from '../SendConfirmationModal/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput'

import {
  validateAmount,
  sendTez,
  fetchTransactionAverageFees
} from '../../reduxContent/sendTezos/thunks';

import Fees from '../Fees/';

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
  margin-top: ${ms(2)};
`;

const InputAmount = styled.div`
  position: relative;
  width: 50%;
  margin-right: 50px;
`;

type Props = {
  isReady?: boolean,
  sendTez?: () => {},
  selectedAccountHash?: string,
  selectedParentHash?: string,
  validateAmount?: () => {},
  t: () => {}
};

const initialState = {
  isLoading: false,
  isConfirmationModalOpen: false,
  password: '',
  toAddress: '',
  amount: null,
  fee: 100,
  isShowedPwd: false,
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  }
};

class Send extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    const { fetchTransactionAverageFees } = this.props;
    const averageFees = await fetchTransactionAverageFees();
    this.setState({ averageFees, fee: averageFees.low });
  }

  openConfirmation = () => this.setState({ isConfirmationModalOpen: true });
  closeConfirmation = () => {
    const { averageFees, fee } = this.state;
    this.setState({ ...initialState, averageFees, fee });
  };
  handlePasswordChange = (password) =>  this.setState({ password });
  handleToAddressChange = (_, toAddress) =>  this.setState({ toAddress });
  handleAmountChange = (_, amount) =>  this.setState({ amount });
  handleFeeChange = (fee) =>  this.setState({ fee });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

  validateAmount = async () => {
    const { amount, toAddress } = this.state;
    const { validateAmount } = this.props;
    if (await validateAmount(amount, toAddress)) {
      this.openConfirmation();
    }
  };

  onSend = async () => {
    const { password, toAddress, amount, fee } = this.state;
    const { sendTez, selectedAccountHash, selectedParentHash } = this.props;
    this.setIsLoading(true);
    if (
      await sendTez(
        password,
        toAddress,
        amount,
        Math.floor(fee),
        selectedAccountHash,
        selectedParentHash
      )
    ) {
      this.closeConfirmation();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { isReady, t } = this.props;

    const {
      isLoading,
      isConfirmationModalOpen,
      password,
      toAddress,
      amount,
      fee,
      averageFees,
      isShowedPwd
    } = this.state;

    return (
      <SendContainer>
        <TextField
          floatingLabelText="Address"
          style={{ width: '100%' }}
          value={toAddress}
          onChange={this.handleToAddressChange}
        />
        <AmountContainer>
          <InputAmount>
            <TezosNumericInput labelText={t('general.amount')} amount={this.state.amount}  handleAmountChange={this.handleAmountChange} />
          </InputAmount>
          <Fees
            styles={{ width: '50%' }}
            low={averageFees.low}
            medium={averageFees.medium}
            high={averageFees.high}
            fee={fee}
            onChange={this.handleFeeChange}
          />
        </AmountContainer>
        <SendButton
          disabled={!isReady}
          onClick={this.validateAmount}
          buttonTheme="secondary"
          small
        >
          Send
        </SendButton>
        <SendConfirmationModal
          amount={amount}
          password={password}
          address={toAddress}
          open={isConfirmationModalOpen}
          onCloseClick={this.closeConfirmation}
          onPasswordChange={this.handlePasswordChange}
          onSend={this.onSend}
          isLoading={isLoading}
          isShowedPwd={isShowedPwd}
          onShowPwd={()=> this.setState({isShowedPwd: !isShowedPwd})}
        />
      </SendContainer>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTransactionAverageFees,
      sendTez,
      validateAmount
    },
    dispatch
  );

export default compose(wrapComponent, connect(null, mapDispatchToProps))(Send);