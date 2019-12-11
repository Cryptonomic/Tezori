// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

import Button from '../Button/';
import { ms } from '../../styles/helpers';
import SendConfirmationModal from '../SendConfirmationModal';
import SendLedgerConfirmationModal from '../SendLedgerConfirmationModal';
import { wrapComponent } from '../../utils/i18n';
import InputAddress from '../InputAddress';
import TezosNumericInput from '../TezosNumericInput';
import TezosAmount from '../TezosAmount/';
import TezosIcon from '../TezosIcon/';
import TextField from '../TextField';
import Tooltip from '../Tooltip/';

import {
  validateAmount,
  sendTez,
  fetchTransactionAverageFees,
  sendDelegatedFundsThunk
} from '../../reduxContent/sendTezos/thunks';
import { depositThunk } from '../../reduxContent/invoke/thunks';

import { getIsLedger } from '../../reduxContent/wallet/selectors';

import Fees from '../Fees/';
import {
  getIsReveal,
  getIsImplicitAndEmpty
} from '../../reduxContent/wallet/thunks';
import { OPERATIONFEE, REVEALOPERATIONFEE } from '../../constants/LowFeeValue';

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  position: relative;
`;

const SendTitle = styled.div`
  font-size: 24px;
  line-height: 34px;
  letter-spacing: 1px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const FeesBurnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BurnsContainer = styled.div`
  width: 45%;
  position: relative;
`;

const TextfieldTooltip = styled(Button)`
  position: absolute;
  left: 80px;
  top: 22px;
`;

const BurnTooltip = styled(TextfieldTooltip)`
  left: 80px;
`;
const FeeTooltip = styled(Button)`
  position: relative;
  top: 3px;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  left: 70px;
  top: 25px;
  display: block;
`;

const TooltipContainer = styled.div`
  padding: 10px;
  color: #000;
  font-size: 14px;
  max-width: 312px;

  .customArrow .rc-tooltip-arrow {
    left: 66%;
  }
`;

const TooltipTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const TooltipContent = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 21px;
  width: 270px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.black};
`;

const BoldSpan = styled.span`
  font-weight: 500;
`;

const SendButton = styled(Button)`
  margin-left: auto;
  width: 194px;
  height: 50px;
`;

const InputAmount = styled.div`
  position: relative;
  width: 100%;
`;

const FeeContainer = styled.div`
  position: relative;
  width: 45%;
  display: flex;
  height: 64px;
`;

const TotalContent = styled.div``;

const BalanceContent = styled.div`
  margin-left: 40px;
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
const TotalAmount = styled(TezosAmount)``;
const BalanceAmount = styled(TezosAmount)``;

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

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  height: 96px;
  width: 100%;
  margin-top: 15px;
`;

const utez = 1000000;

type Props = {
  isReady?: boolean,
  sendTez?: () => {},
  sendDelegatedFundsThunk: () => {},
  depositThunk: () => {},
  selectedAccountHash?: string,
  selectedParentHash?: string,
  validateAmount?: () => {},
  t: () => {},
  getIsImplicitAndEmpty: () => {},
  getIsReveal: () => {},
  fetchTransactionAverageFees: () => {},
  addressBalance: number,
  isLedger: boolean
};

const initialState = {
  isLoading: false,
  isConfirmationModalOpen: false,
  password: '',
  toAddress: '',
  amount: '',
  fee: 2840,
  miniFee: 0,
  isShowedPwd: false,
  isDisplayedBurn: false,
  isDisplayedFeeTooltip: false,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  },
  isAddressIssue: true,
  addressType: ''
};
class Send extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    this.mounted = true;
    const {
      fetchTransactionAverageFees,
      addressBalance,
      getIsReveal,
      selectedAccountHash,
      selectedParentHash
    } = this.props;
    const averageFees = await fetchTransactionAverageFees();
    const isRevealed = await getIsReveal(
      selectedAccountHash,
      selectedParentHash
    );
    let miniLowFee = OPERATIONFEE;
    if (!isRevealed) {
      averageFees.low += REVEALOPERATIONFEE;
      averageFees.medium += REVEALOPERATIONFEE;
      averageFees.high += REVEALOPERATIONFEE;
      miniLowFee += REVEALOPERATIONFEE;
    }
    if (averageFees.low < miniLowFee) {
      averageFees.low = miniLowFee;
    }
    if (this.mounted) {
      this.setState({
        averageFees,
        fee: averageFees.medium,
        total: averageFees.low,
        balance: addressBalance,
        isDisplayedFeeTooltip: !isRevealed,
        miniFee: miniLowFee
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onUseMax = () => {
    const { addressBalance } = this.props;
    const { fee, isDisplayedBurn } = this.state;
    const burnFee = isDisplayedBurn ? 257000 : 0;
    const max = addressBalance - fee - burnFee - 1;
    if (max > 0) {
      const amount = (max / utez).toFixed(6);
      const total = addressBalance;
      this.setState({ amount, total, balance: 0 });
    } else {
      const amount = '0';
      const total = fee;
      const balance = addressBalance - total;
      this.setState({ amount, total, balance });
    }
  };

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onSend();
    }
  };

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
  handlePasswordChange = password => this.setState({ password });
  handleToAddressChange = async toAddress => {
    const { getIsImplicitAndEmpty, addressBalance } = this.props;
    const { amount, fee } = this.state;
    const isDisplayedBurn = await getIsImplicitAndEmpty(toAddress);
    const burnFee = isDisplayedBurn ? 257000 : 0;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + burnFee;
    const balance = addressBalance - total;
    this.setState({ toAddress, isDisplayedBurn, total, balance });
  };
  handleAmountChange = amount => {
    const { addressBalance } = this.props;
    const { fee, isDisplayedBurn } = this.state;
    const burnFee = isDisplayedBurn ? 257000 : 0;
    const newAmount = amount || '0';
    const commaReplacedAmount = newAmount.replace(',', '.');
    const numAmount = parseFloat(commaReplacedAmount) * utez;
    const total = numAmount + fee + burnFee;
    const balance = addressBalance - total;
    this.setState({ amount, total, balance });
  };
  handleFeeChange = fee => {
    const { addressBalance } = this.props;
    const { amount, isDisplayedBurn } = this.state;
    const burnFee = isDisplayedBurn ? 257000 : 0;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + burnFee;
    const balance = addressBalance - total;
    this.setState({ fee, total, balance });
  };

  setIsLoading = isLoading => this.setState({ isLoading });

  validateAmount = async () => {
    const { amount, toAddress } = this.state;
    const { validateAmount, isLedger } = this.props;
    if (await validateAmount(amount, toAddress)) {
      this.openConfirmation();
      if (isLedger) {
        this.onSend();
      }
    }
  };

  onSend = async () => {
    const { password, toAddress, amount, fee, addressType } = this.state;
    const {
      sendTez,
      sendDelegatedFundsThunk,
      depositThunk,
      selectedAccountHash,
      selectedParentHash
    } = this.props;
    this.setIsLoading(true);
    if (
      selectedAccountHash.startsWith('KT1') &&
      selectedParentHash !== toAddress
    ) {
      await sendDelegatedFundsThunk(
        password,
        toAddress,
        amount,
        Math.floor(fee),
        selectedAccountHash,
        selectedParentHash
      ).catch(err => {
        console.log(err);
        return false;
      });
    } else if (selectedAccountHash.startsWith('KT1')) {
      await depositThunk(
        fee,
        amount,
        password,
        toAddress,
        selectedParentHash
      ).catch(err => {
        console.log(err);
        return false;
      });
    } else if (addressType === 'kt') {
      await depositThunk(
        fee,
        amount,
        password,
        toAddress,
        selectedParentHash
      ).catch(err => {
        console.log(err);
        return false;
      });
    } else {
      await sendTez(
        password,
        toAddress,
        amount,
        Math.floor(fee),
        selectedAccountHash,
        selectedParentHash
      ).catch(err => {
        console.log(err);
        return false;
      });
    }

    this.closeConfirmation();
    this.setIsLoading(false);
  };

  getBalanceState = (balance, amount) => {
    const { t } = this.props;
    const realAmount = !amount ? Number(amount) : 0;

    if (balance <= 0 || balance < realAmount) {
      return {
        isIssue: true,
        warningMessage: t('components.send.warnings.total_exceeds'),
        balanceColor: 'error1'
      };
    }

    return {
      isIssue: false,
      warningMessage: '',
      balanceColor: 'gray8'
    };
  };

  renderBurnToolTip = () => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        <TooltipTitle>{t('components.send.burn_tooltip_title')}</TooltipTitle>
        <TooltipContent>
          <Trans i18nKey="components.send.burn_tooltip_content">
            The recepient address you entered has a zero balance. Sending funds
            to an empty Manager address (tz1,2,3) requires a one-time
            <BoldSpan>0.257</BoldSpan> XTZ burn fee.
          </Trans>
        </TooltipContent>
      </TooltipContainer>
    );
  };

  renderError = warningMessage => {
    return (
      <ErrorContainer>
        <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
        {warningMessage}
      </ErrorContainer>
    );
  };

  renderFeeToolTip = () => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        <TooltipTitle>{t('components.send.fee_tooltip_title')}</TooltipTitle>
        <TooltipContent>
          <Trans i18nKey="components.send.fee_tooltip_content">
            This address is not revealed on the blockchain. We have added
            <BoldSpan>0.001420 XTZ</BoldSpan> for Public Key Reveal to your
            regular send operation fee.
          </Trans>
        </TooltipContent>
      </TooltipContainer>
    );
  };

  render() {
    const { isReady, t, isLedger, selectedAccountHash } = this.props;

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
      balance,
      isDisplayedBurn,
      isDisplayedFeeTooltip,
      miniFee,
      isAddressIssue,
      addressType
    } = this.state;

    const { isIssue, warningMessage, balanceColor } = this.getBalanceState(
      balance,
      amount
    );

    const error = isIssue ? this.renderError(warningMessage) : '';

    const isDisabled =
      !amount === '0' ||
      !amount ||
      !toAddress ||
      !isReady ||
      isIssue ||
      isLoading ||
      isAddressIssue;

    const buttonTitle =
      addressType === 'kt'
        ? t('general.verbs.deposit')
        : t('general.verbs.send');

    return (
      <SendContainer>
        <SendTitle>{t('components.send.send_xtz')}</SendTitle>
        <InputAddress
          labelText={t('components.send.recipient_address')}
          userAddress={selectedAccountHash}
          operationType="send"
          onAddressChange={this.handleToAddressChange}
          onIssue={status => this.setState({ isAddressIssue: status })}
          onAddressType={type => this.setState({ addressType: type })}
        />
        <InputAmount>
          <TezosNumericInput
            decimalSeparator={t('general.decimal_separator')}
            labelText={t('general.nouns.amount')}
            amount={amount}
            handleAmountChange={this.handleAmountChange}
            errorText={error}
          />
          <UseMax onClick={this.onUseMax}>{t('general.verbs.use_max')}</UseMax>
        </InputAmount>
        <FeesBurnContainer>
          <FeeContainer>
            <Fees
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              miniFee={miniFee}
              onChange={this.handleFeeChange}
              tooltip={
                isDisplayedFeeTooltip ? (
                  <Tooltip
                    position="bottom"
                    content={this.renderFeeToolTip()}
                    align={{
                      offset: [70, 0]
                    }}
                    arrowPos={{
                      left: '71%'
                    }}
                  >
                    <FeeTooltip buttonTheme="plain">
                      <HelpIcon iconName="help" size={ms(1)} color="gray5" />
                    </FeeTooltip>
                  </Tooltip>
                ) : null
              }
            />
          </FeeContainer>
          {isDisplayedBurn && (
            <BurnsContainer>
              <TextField
                disabled
                label={t('components.transaction.burn')}
                defaultValue="0.257000"
              />
              <TezosIconInput color="gray5" iconName="tezos" />
              <Tooltip
                position="bottom"
                content={this.renderBurnToolTip()}
                align={{
                  offset: [70, 0]
                }}
                arrowPos={{
                  left: '71%'
                }}
              >
                <BurnTooltip buttonTheme="plain">
                  <HelpIcon iconName="help" size={ms(1)} color="gray5" />
                </BurnTooltip>
              </Tooltip>
            </BurnsContainer>
          )}
        </FeesBurnContainer>

        <BottomContainer>
          <TotalContent>
            <BalanceTitle>{t('general.nouns.total')}</BalanceTitle>
            <TotalAmount
              weight="500"
              color={amount ? 'gray3' : 'gray8'}
              size={ms(0.65)}
              amount={total}
            />
          </TotalContent>
          <BalanceContent>
            <BalanceTitle>{t('general.nouns.remaining_balance')}</BalanceTitle>
            <BalanceAmount
              weight="500"
              color={balanceColor}
              size={ms(0.65)}
              amount={balance}
            />
          </BalanceContent>
          <SendButton
            disabled={isDisabled}
            onClick={this.validateAmount}
            buttonTheme="primary"
          >
            {buttonTitle}
          </SendButton>
        </BottomContainer>

        {!isLedger && (
          <SendConfirmationModal
            onEnterPress={event => this.onEnterPress(event.key, isDisabled)}
            amount={amount}
            fee={fee}
            source={selectedAccountHash}
            password={password}
            address={toAddress}
            open={isConfirmationModalOpen}
            onCloseClick={this.closeConfirmation}
            onPasswordChange={this.handlePasswordChange}
            onSend={this.onSend}
            isLoading={isLoading}
            isShowedPwd={isShowedPwd}
            isDisplayedBurn={isDisplayedBurn}
            onShowPwd={() => this.setState({ isShowedPwd: !isShowedPwd })}
          />
        )}

        {isLedger && (
          <SendLedgerConfirmationModal
            amount={amount}
            fee={fee}
            address={toAddress}
            source={selectedAccountHash}
            open={isConfirmationModalOpen}
            onCloseClick={this.closeConfirmation}
            isLoading={isLoading}
          />
        )}
      </SendContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLedger: getIsLedger(state)
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTransactionAverageFees,
      sendTez,
      depositThunk,
      validateAmount,
      getIsReveal,
      getIsImplicitAndEmpty,
      sendDelegatedFundsThunk
    },
    dispatch
  );

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Send);
