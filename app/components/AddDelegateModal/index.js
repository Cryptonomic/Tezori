// @flow
import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from '../TextField';
import TezosNumericInput from '../TezosNumericInput/';

import Modal from '../CustomModal';
import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import Button from '../Button/';
import Loader from '../Loader/';
import Fees from '../Fees/';
import PasswordInput from '../PasswordInput/';
import InputAddress from '../InputAddress/';
import TezosAmount from '../TezosAmount/';

import AddDelegateLedgerModal from '../AddDelegateLedgerModal';

import {
  originateContract,
  fetchOriginationAverageFees
} from '../../reduxContent/originate/thunks';

import { getIsReveal } from '../../reduxContent/wallet/thunks';

import { setIsLoading } from '../../reduxContent/wallet/actions';

import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { OPERATIONFEE, REVEALOPERATIONFEE } from '../../constants/LowFeeValue';

type Props = {
  isLoading: boolean,
  selectedParentHash: string,
  originateContract: () => {},
  fetchOriginationAverageFees: () => {},
  open: boolean,
  onCloseClick: () => {},
  t: () => {},
  setIsLoading: () => {},
  managerBalance: ?number,
  isLedger: boolean,
  getIsReveal: () => {}
};

const InputAddressContainer = styled.div`
  padding: 0 76px;
`;

const AmountFeePassContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 43%;
  justify-content: center;
`;

const AmountSendContainer = styled.div`
  width: 100%;
  position: relative;
`;

const FeeContainer = styled.div`
  width: 100%;
  display: flex;
  height: 64px;
`;

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
  padding: 0 76px 15px 76px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
  height: 100px;
`;

const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
`;

const MainContainer = styled.div`
  display: flex;
  padding: 20px 76px 0 76px;
`;
const BalanceContainer = styled.div`
  padding: 0 0px 0 20px;
  flex: 1;
  position: relative;
  margin: 0 0 0px 35px;
`;

const BalanceArrow = styled.div`
  top: 50%;
  left: 4px;
  margin-top: -17px;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  border-right: 20px solid ${({ theme: { colors } }) => colors.gray1};
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

const GasInputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  left: 70px;
  top: 25px;
  display: block;
`;

const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 24px;
  font-size: 12px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;
const TotalAmount = styled(TezosAmount)`
  margin-bottom: 22px;
`;

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

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 27px;
`;

const FeeTooltip = styled(Button)`
  position: relative;
  top: 3px;
`;

const BurnTooltip = styled(TextfieldTooltip)`
  right: 115px;
  top: 23px;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
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

const utez = 1000000;

const defaultState = {
  delegate: '',
  amount: '',
  fee: 1420,
  miniFee: 0,
  passPhrase: '',
  isShowedPwd: false,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  },
  isDelegateIssue: true,
  gas: 257000,
  isOpenLedgerConfirm: false,
  isDisplayedFeeTooltip: false
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const {
      open,
      fetchOriginationAverageFees,
      managerBalance,
      getIsReveal,
      selectedParentHash
    } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchOriginationAverageFees();
      const isRevealed = await getIsReveal(
        selectedParentHash,
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
      const fee = averageFees.low;
      const total = fee + this.state.gas;
      this.setState({
        averageFees,
        fee,
        total,
        balance: managerBalance - total,
        isDisplayedFeeTooltip: !isRevealed,
        miniFee: miniLowFee
      }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  onUseMax = () => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const max = managerBalance - fee - gas;
    if (max > 0) {
      const amount = (max / utez).toFixed(6);
      const total = managerBalance;
      const balance = 0;
      this.setState({ amount, total, balance });
    } else {
      const amount = '0';
      const total = fee + gas;
      const balance = managerBalance - total;
      this.setState({ amount, total, balance });
    }
  };

  changeDelegate = delegate => this.setState({ delegate });
  changeAmount = amount => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const newAmount = amount || '0';
    const commaReplacedAmount = newAmount.replace(',', '.');
    const numAmount = parseFloat(commaReplacedAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ amount, total, balance });
  };
  changeFee = fee => {
    const { managerBalance } = this.props;
    const { gas, amount } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ fee, total, balance });
  };
  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  createAccount = async () => {
    const {
      originateContract,
      selectedParentHash,
      setIsLoading,
      isLedger
    } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    setIsLoading(true);
    if (isLedger) {
      this.openLedgerConfirmation();
    }

    const isCreated = await originateContract(
      delegate,
      amount,
      Math.floor(fee),
      passPhrase,
      selectedParentHash
    ).catch(err => {
      console.error(err);
      return false;
    });
    this.setState({ isOpenLedgerConfirm: false });
    setIsLoading(false);
    if (isCreated) {
      this.onCloseClick();
    }
  };

  renderGasToolTip = gas => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        {t('components.addDelegateModal.gas_tool_tip', { gas })}
      </TooltipContainer>
    );
  };

  onCloseClick = () => {
    const { averageFees, gas } = this.state;
    const { managerBalance, onCloseClick } = this.props;
    const fee = averageFees.low;
    const total = fee + gas;
    this.setState({ ...defaultState, total, balance: managerBalance - total });
    onCloseClick();
  };

  getBalanceState = (balance, amount, t) => {
    if (balance < 0) {
      return {
        isIssue: true,
        warningMessage: t('components.addDelegateModal.warning1'),
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

  openLedgerConfirmation = () => this.setState({ isOpenLedgerConfirm: true });
  closeLedgerConfirmation = () => this.setState({ isOpenLedgerConfirm: false });

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.createAccount();
    }
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
    const { isLoading, open, t, isLedger, selectedParentHash } = this.props;
    const {
      averageFees,
      delegate,
      amount,
      fee,
      miniFee,
      passPhrase,
      isShowedPwd,
      gas,
      total,
      balance,
      isDelegateIssue,
      isOpenLedgerConfirm,
      isDisplayedFeeTooltip
    } = this.state;

    const isDisabled =
      isLoading ||
      !delegate ||
      !amount ||
      (!passPhrase && !isLedger) ||
      balance < 0 ||
      isDelegateIssue;
    const { isIssue, warningMessage, balanceColor } = this.getBalanceState(
      balance,
      amount,
      t
    );
    return (
      <Modal
        onKeyDown={event => this.onEnterPress(event.key, isDisabled)}
        title={t('components.addDelegateModal.add_delegate_title')}
        open={open}
        onClose={this.onCloseClick}
      >
        <InputAddressContainer>
          <InputAddress
            labelText={t('general.nouns.delegate_address')}
            addressType="delegate"
            tooltip
            onAddressChange={this.changeDelegate}
            onIssue={status => this.setState({ isDelegateIssue: status })}
          />
        </InputAddressContainer>
        <MainContainer>
          <AmountFeePassContainer>
            <AmountSendContainer>
              <TezosNumericInput
                decimalSeparator={t('general.decimal_separator')}
                labelText={t('general.nouns.amount')}
                amount={amount}
                handleAmountChange={this.changeAmount}
              />
              <UseMax onClick={this.onUseMax}>
                {t('general.verbs.use_max')}
              </UseMax>
            </AmountSendContainer>
            <FeeContainer>
              <Fees
                low={averageFees.low}
                medium={averageFees.medium}
                high={averageFees.high}
                fee={fee}
                miniFee={miniFee}
                onChange={this.changeFee}
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
            <GasInputContainer>
              <TextField
                disabled
                label={t('general.nouns.gas')}
                defaultValue="0.257000"
              />
              <TezosIconInput color="gray5" iconName="tezos" />
              <Tooltip
                position="bottom"
                content={this.renderGasToolTip(gas / utez)}
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
            </GasInputContainer>
          </AmountFeePassContainer>
          <BalanceContainer>
            <BalanceArrow />
            <BalanceContent>
              <BalanceTitle>{t('general.nouns.total')}</BalanceTitle>
              <TotalAmount
                weight="500"
                color={amount ? 'gray3' : 'gray8'}
                size={ms(0.65)}
                amount={total}
              />
              <BalanceTitle>
                {t('general.nouns.remaining_balance')}
              </BalanceTitle>
              <BalanceAmount
                weight="500"
                color={balanceColor}
                size={ms(-0.75)}
                amount={balance}
              />
              {isIssue && (
                <ErrorContainer>
                  <WarningIcon
                    iconName="warning"
                    size={ms(-1)}
                    color="error1"
                  />
                  {warningMessage}
                </ErrorContainer>
              )}
            </BalanceContent>
          </BalanceContainer>
        </MainContainer>

        <PasswordButtonContainer>
          {!isLedger && (
            <PasswordInput
              label={t('general.nouns.wallet_password')}
              isShowed={isShowedPwd}
              password={passPhrase}
              changFunc={this.updatePassPhrase}
              containerStyle={{ width: '60%', marginTop: '10px' }}
              onShow={() => this.setState({ isShowedPwd: !isShowedPwd })}
            />
          )}
          <DelegateButton
            buttonTheme="primary"
            disabled={isDisabled}
            onClick={this.createAccount}
          >
            {t('general.verbs.delegate')}
          </DelegateButton>
        </PasswordButtonContainer>
        {isLoading && <Loader />}
        {isLedger && isOpenLedgerConfirm && (
          <AddDelegateLedgerModal
            amount={amount}
            fee={fee}
            address={delegate}
            source={selectedParentHash}
            manager={selectedParentHash}
            open={isOpenLedgerConfirm}
            onCloseClick={this.closeLedgerConfirmation}
            isLoading={isLoading}
          />
        )}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.wallet.get('isLoading'),
    isLedger: getIsLedger(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setIsLoading,
      fetchOriginationAverageFees,
      originateContract,
      getIsReveal
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDelegateModal);
