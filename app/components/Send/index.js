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
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  justify-content: center;
`;

const SendButton = styled(Button)`
  margin-top: ${ms(2)};
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
  margin: 15px 0 0px 40px;
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
  padding: ${ms(1)} ${ms(1)} ${ms(1)} ${ms(4)};
  color: #123262;
  text-align: left;
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 38px;
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
`;
const BalanceTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 14px;
`;
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
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
  addressBalance: number
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
    this.setState({ averageFees, fee: averageFees.low, total: averageFees.low, balance: addressBalance });
  }

  onUseMax = () => {
    const { addressBalance } = this.props;
    const { fee } = this.state;
    const max = addressBalance - fee - 1;
    const amount = (max/utez).toFixed(6);
    const total = addressBalance - 1;
    const balance = 1;
    this.setState({ amount, total, balance });
  }

  openConfirmation = () => this.setState({ isConfirmationModalOpen: true });
  closeConfirmation = () => {
    const { averageFees, fee } = this.state;
    this.setState({ ...initialState, averageFees, fee });
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
      isShowedPwd,
      total,
      balance
    } = this.state;

    return (
      <SendContainer>
        <InputAddress labelText={t('general.address')} userAddress={this.props.selectedAccountHash} addressType="send" tooltip={false} changeDelegate={this.handleToAddressChange} />
        <MainContainer>
          <AmountContainer>
            <InputAmount>
              <TezosNumericInput decimalSeparator={t('general.decimal_separator')} labelText={t('general.amount')} amount={this.state.amount}  handleAmountChange={this.handleAmountChange} />
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
                color="gray3"
                size={ms(1)}
                amount={total}
              />              
              <BalanceTitle>Remaining Balance</BalanceTitle>
              <BalanceAmount
                weight='500'
                color={balance<1?'error1':'gray3'}
                size={ms(-1)}
                amount={balance}
              />
              {balance < 1 &&
                <ErrorContainer>
                  <WarningIcon
                    iconName="warning"
                    size={ms(-1)}
                    color='error1'
                  />
                  Total exceeds available funds.
                </ErrorContainer>
              }
              
            </BalanceContent>
          </BalanceContainer>
        </MainContainer>
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