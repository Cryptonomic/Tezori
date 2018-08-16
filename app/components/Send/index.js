// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '../Button/';
import { ms } from '../../styles/helpers';
import SendConfirmationModal from '../SendConfirmationModal';
import { wrapComponent } from '../../utils/i18n';
import InputAddress from '../InputAddress';
import TezosNumericInput from '../TezosNumericInput';
import TezosAmount from '../TezosAmount/';
import TezosIcon from '../TezosIcon/';

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
  height: 345px;
  position: relative;
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const SendButton = styled(Button)`
  position: absolute;
  bottom: 0;
`;

const InputAmount = styled.div`
  position: relative;
  width: 100%;
`;

const MainContainer = styled.div`
  display: flex;
  width: 100%;
`;
const BalanceContainer = styled.div`
  padding: 0 0px 0 20px;
  flex: 1;
  position: relative;
  margin: 0px 0 0px 40px;
`;
const BalanceArrow = styled.div`
  top: 50%;
  left: 4px;
  margin-top: -17px;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-right: 20px solid ${({ theme: { colors } }) => colors.gray1};;
  width: 0;
  height: 0;
  position: absolute;
`;
const BalanceContent = styled.div`
  padding: ${ms(0)} ${ms(0)} ${ms(0)} ${ms(3)};
  color: #123262;
  text-align: left;
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 25px;
  font-size: 12px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;
const TotalAmount = styled(TezosAmount)`
  margin-bottom: 22px;
`;
const BalanceAmount = styled(TezosAmount)`
`;

const WarningIcon = styled(TezosIcon)`
  padding: 0 ${ms(-9)} 0 0;
  position: relative;
  top: 1px;
`;
const BalanceTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 14px;
  font-weight: 300;
`;
const ErrorContainer = styled.div`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.error1};
`;

const utez = 1000000;

type Props = {
  isReady?: boolean,
  sendTez?: () => {},
  selectedAccountHash?: string,
  selectedParentHash?: string,
  validateAmount?: () => {},
  t: () => {},
  addressBalance: number,
  isManager: boolean
};

const initialState = {
  isLoading: false,
  isConfirmationModalOpen: false,
  password: '',
  toAddress: '',
  amount: '',
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
    const { fetchTransactionAverageFees, addressBalance } = this.props;
    const averageFees = await fetchTransactionAverageFees();
    this.setState({
      averageFees,
      fee: averageFees.low,
      total: averageFees.low,
      balance: addressBalance
    });
  }

  onUseMax = () => {
    const { addressBalance, isManager } = this.props;
    const { fee } = this.state;
    let balance = 1;
    if (!isManager) {
      balance = 0;
    }
    const max = addressBalance - fee - balance;
    const amount = (max/utez).toFixed(6);
    const total = addressBalance - balance;    
    this.setState({ amount, total, balance });
  }

  openConfirmation = () => this.setState({ isConfirmationModalOpen: true });
  closeConfirmation = () => {
    const { averageFees } = this.state;
    this.setState({
      ...initialState,
      toAddress: '',
      averageFees,
      fee: averageFees.low,
      total: averageFees.low
    });
  };
  handlePasswordChange = (password) =>  this.setState({ password });
  handleToAddressChange = (toAddress) =>  this.setState({ toAddress });
  handleAmountChange = (amount) =>  this.setState({ amount });
  handleAmountChange = (amount) => {
    const { addressBalance } = this.props;
    const { fee } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee;
    const balance = addressBalance - total;
    this.setState({ amount, total, balance });
  };
  handleFeeChange = (fee) => {
    const { addressBalance } = this.props;
    const { amount } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee;
    const balance = addressBalance - total;
    this.setState({ fee, total, balance });
  };

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

  getBalanceState = (balance, amount, isManager) => {
    if (balance < 0) {
      return {
        isIssue: true,
        warningMessage: 'Total exceeds available funds',
        balanceColor: 'error1'
      };
    }
    if (isManager && balance === 0 ) {
      return {
        isIssue: true,
        warningMessage: 'Manager Addresses are not yet allowed to have less than 1 µtz',
        balanceColor: 'error1'
      };
    }
    
    if (amount) {
      return {
        isIssue: false,
        warningMessage: '',
        balanceColor: 'gray3'
      };
    }
    return {
      isIssue: false,
      warningMessage: '',
      balanceColor: 'gray8'
    };
  }

  render() {
    const { isReady, t, isManager } = this.props;

    const {
      isLoading,
      isConfirmationModalOpen,
      password,
      toAddress,
      amount,
      fee,
      averageFees,
      isShowedPwd,
      total,
      balance
    } = this.state;

    const {
      isIssue,
      warningMessage,
      balanceColor
    } = this.getBalanceState(balance, amount, isManager);

    const isDisabled = !isReady || isIssue || isLoading || !amount || !toAddress;

    return (
      <SendContainer>
        <InputAddress
          labelText={t('general.address')}
          userAddress={this.props.selectedAccountHash}
          addressType="send"
          changeDelegate={this.handleToAddressChange}
        />
        <MainContainer>
          <AmountContainer>
            <InputAmount>
              <TezosNumericInput
                decimalSeparator={t('general.decimal_separator')}
                labelText={t('general.amount')}
                amount={this.state.amount}
                handleAmountChange={this.handleAmountChange}
              />
              <UseMax onClick={this.onUseMax}>Use Max</UseMax>
            </InputAmount>
            <Fees
              styles={{ width: '100%' }}
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              onChange={this.handleFeeChange}
            />
          </AmountContainer>
          <BalanceContainer>
            <BalanceArrow />
            <BalanceContent>
              <BalanceTitle>Total</BalanceTitle>
              <TotalAmount
                weight='500'
                color={amount?'gray3':'gray8'}
                size={ms(0.65)}
                amount={total}
              />              
              <BalanceTitle>Remaining Balance</BalanceTitle>
              <BalanceAmount
                weight='500'
                color={balanceColor}
                size={ms(-0.75)}
                amount={balance}
              />
              {isIssue &&
                <ErrorContainer>
                  <WarningIcon
                    iconName="warning"
                    size={ms(-1)}
                    color='error1'
                  />
                  {warningMessage}
                </ErrorContainer>
              }
              
            </BalanceContent>
          </BalanceContainer>
        </MainContainer>
        <SendButton
          disabled={isDisabled}
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