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
  fetchTransactionAverageFees
} from '../../reduxContent/sendTezos/thunks';

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
const FeeTooltip = styled(TextfieldTooltip)`
  left: 150px;
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
  &&& {
    [class*='TextField__InputWrapper'] {
      &:after {
        border-bottom-color: ${({ error, theme: { colors } }) =>
          error ? colors.error1 : colors.accent} !important;
      }
      &:before {
        border-bottom-color: ${({ error, theme: { colors } }) =>
          error ? colors.error1 : colors.accent} !important;
      }
      &:hover:before {
        border-bottom: solid 2px
          ${({ error, theme: { colors } }) =>
            error ? colors.error1 : colors.accent} !important;
      }
    }
  }
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
  position: absolute;
  left: 0;
  bottom: 0;
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
  selectedAccountHash?: string,
  selectedParentHash?: string,
  validateAmount?: () => {},
  t: () => {},
  addressBalance: number,
  isLedger: boolean
};

const initialState = {
  isLoading: false,
  isConfirmationModalOpen: false,
  password: '',
  toAddress: '',
  amount: '',
  fee: 100,
  isShowedPwd: false,
  isDisplayedBurn: false,
  isDisplayedFeeTooltip: false,
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
    const miniLowFee = isRevealed ? OPERATIONFEE : REVEALOPERATIONFEE;
    if (averageFees.low < miniLowFee) {
      averageFees.low = miniLowFee;
    }
    this.setState({
      averageFees,
      fee: averageFees.low,
      total: averageFees.low,
      balance: addressBalance,
      isDisplayedFeeTooltip: !isRevealed
    });
  }

  onUseMax = () => {
    const { addressBalance } = this.props;
    const { fee, isDisplayedBurn } = this.state;
    const burnFee = isDisplayedBurn ? 257000 : 0;
    const max = addressBalance - fee - burnFee;
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
    const { password, toAddress, amount, fee } = this.state;
    const { sendTez, selectedAccountHash, selectedParentHash } = this.props;
    this.setIsLoading(true);
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
    this.closeConfirmation();
    this.setIsLoading(false);
  };

  getBalanceState = (balance, amount) => {
    const { t } = this.props;
    if (balance < 0) {
      return {
        isIssue: true,
        warningMessage: t('components.send.warnings.total_exceeds'),
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

  renderFeeToolTip = () => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        <TooltipTitle>{t('components.send.fee_tooltip_title')}</TooltipTitle>
        <TooltipContent>
          <Trans i18nKey="components.send.fee_tooltip_content">
            This is your first transaction from this address and it requires for
            us to reveal your public key to the blockchain. We have added
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
      isDisplayedFeeTooltip
    } = this.state;

    const { isIssue, warningMessage, balanceColor } = this.getBalanceState(
      balance,
      amount
    );

    const isDisabled =
      !isReady || isIssue || isLoading || !amount || !toAddress;

    return (
      <SendContainer>
        <SendTitle>{t('components.send.send_xtz')}</SendTitle>
        <InputAddress
          labelText={t('components.send.recepient_address')}
          userAddress={this.props.selectedAccountHash}
          addressType="send"
          changeDelegate={this.handleToAddressChange}
        />
        <InputAmount error={isIssue}>
          <TezosNumericInput
            decimalSeparator={t('general.decimal_separator')}
            labelText={t('general.nouns.amount')}
            amount={this.state.amount}
            handleAmountChange={this.handleAmountChange}
          />
          <UseMax onClick={this.onUseMax}>{t('general.verbs.use_max')}</UseMax>
          {isIssue && (
            <ErrorContainer>
              <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
              {warningMessage}
            </ErrorContainer>
          )}
        </InputAmount>
        <FeesBurnContainer>
          <FeeContainer>
            <Fees
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              onChange={this.handleFeeChange}
            />
            {isDisplayedFeeTooltip && (
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
            )}
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
            {t('general.verbs.send')}
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
      validateAmount,
      getIsReveal,
      getIsImplicitAndEmpty
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
