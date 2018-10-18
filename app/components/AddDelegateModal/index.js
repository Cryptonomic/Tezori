// @flow
import React, { Component } from 'react';
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

import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

import {
  setIsLoading
} from '../../reduxContent/wallet/actions';

type Props = {
  isLoading: boolean,
  setIsLoading: () => {},
  selectedParentHash: string,
  createNewAccount: () => {},
  fetchOriginationAverageFees: () => {},
  open: boolean,
  onCloseClick: () => {},
  t: () => {},
  managerBalance: number
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
`;

const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
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

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 27px;
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

const utez = 1000000;

const defaultState = {
  delegate: '',
  amount: '',
  fee: 100,
  passPhrase: '',
  isShowedPwd: false,
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  },
  isDelegateIssue: true,
  gas: 257000
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const { open, fetchOriginationAverageFees, managerBalance } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchOriginationAverageFees();
      const fee = averageFees.low;
      const total = fee + this.state.gas;
      this.setState({ averageFees, fee, total, balance: managerBalance - total});// eslint-disable-line react/no-did-update-set-state
    }
  }

  onUseMax = () => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const max = managerBalance - fee - gas - 1;
    if (max > 0) {
      const amount = (max/utez).toFixed(6);
      const total = managerBalance - 1;
      const balance = 1;
      this.setState({ amount, total, balance });
    } else {
      const amount = '0';
      const total = fee + gas;
      const balance = managerBalance - total;
      this.setState({ amount, total, balance });
    }
  }

  changeDelegate = (delegate) => this.setState({ delegate });
  changeAmount = (amount) => {
    const { managerBalance } = this.props;
    const { fee, gas } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ amount, total, balance });
  }
  changeFee = (fee) => {
    const { managerBalance } = this.props;
    const { gas, amount } = this.state;
    const newAmount = amount || '0';
    const numAmount = parseFloat(newAmount) * utez;
    const total = numAmount + fee + gas;
    const balance = managerBalance - total;
    this.setState({ fee, total, balance });
  }
  updatePassPhrase = (passPhrase) => this.setState({ passPhrase });

  createAccount = async () => {
    const { createNewAccount, selectedParentHash, setIsLoading } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    setIsLoading(true);
    if (
      await createNewAccount(
        delegate,
        amount,
        Math.floor(fee),
        passPhrase,
        selectedParentHash
      )
    ) {
      this.onCloseClick();
    }
    setIsLoading(false);
  };

  renderGasToolTip = (gas) => {
    const { t } = this.props;
    return (
      <TooltipContainer>
        {t('components.addDelegateModal.gas_tool_tip', {gas})}
      </TooltipContainer>
    );
  };

  onCloseClick = () => {
    const { averageFees, gas } = this.state;
    const { managerBalance, onCloseClick } = this.props;
    const fee = averageFees.low;
    const total = fee + gas;
    this.setState({...defaultState, total, balance: managerBalance - total});
    onCloseClick();
  }

  getBalanceState = (balance, amount, t) => {
    if (balance < 0) {
      return {
        isIssue: true,
        warningMessage: t('components.addDelegateModal.warning1'),
        balanceColor: 'error1'
      };
    }
    if (balance === 0 ) {
      return {
        isIssue: true,
        warningMessage: t('components.addDelegateModal.warning2'),
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
    const { isLoading, open, t } = this.props;
    const {
      averageFees,
      delegate,
      amount,
      fee,
      passPhrase,
      isShowedPwd,
      gas,
      total,
      balance,
      isDelegateIssue
    } = this.state;
    const isDisabled = isLoading || !delegate || !amount || !passPhrase || balance<1 || isDelegateIssue;
    const {
      isIssue,
      warningMessage,
      balanceColor
    } = this.getBalanceState(balance, amount, t);
    return (
      <Modal
        title={t('components.addDelegateModal.add_delegate_title')}
        open={open}
        onClose={this.onCloseClick}
      >
        <InputAddressContainer>
          <InputAddress
            labelText={t('general.nouns.delegate_address')}
            addressType="delegate"
            tooltip
            changeDelegate={this.changeDelegate}
            onIssue={(status)=> this.setState({isDelegateIssue: status})}
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
              <UseMax onClick={this.onUseMax}>{t('general.verbs.use_max')}</UseMax>
            </AmountSendContainer>
            <FeeContainer>
              <Fees
                low={averageFees.low}
                medium={averageFees.medium}
                high={averageFees.high}
                fee={fee}
                onChange={this.changeFee}
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
                content={this.renderGasToolTip(gas/utez)}
                align={{
                  offset: [70, 0]
                }}
                arrowPos={{
                  left: '71%'
                }}
              >
                <TextfieldTooltip
                  buttonTheme="plain"
                >
                  <HelpIcon
                    iconName="help"
                    size={ms(0)}
                    color='secondary'
                  />
                </TextfieldTooltip>
              </Tooltip>
            </GasInputContainer>
          </AmountFeePassContainer>
          <BalanceContainer>
            <BalanceArrow />
            <BalanceContent>
              <BalanceTitle>{t('general.nouns.total')}</BalanceTitle>
              <TotalAmount
                weight='500'
                color={amount?'gray3':'gray8'}
                size={ms(0.65)}
                amount={total}
              />
              <BalanceTitle>{t('general.nouns.remaining_balance')}</BalanceTitle>
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

        <PasswordButtonContainer>
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={passPhrase}
            changFunc={this.updatePassPhrase}
            containerStyle={{width: '60%', marginTop: '10px'}}
            onShow={()=> this.setState({isShowedPwd: !isShowedPwd})}
          />
          <DelegateButton
            buttonTheme="primary"
            disabled={isDisabled}
            onClick={this.createAccount}
          >
            {t('general.verbs.delegate')}
          </DelegateButton>
        </PasswordButtonContainer>
        {isLoading && <Loader />}
      </Modal>
    );
  }
}

function mapStateToProps({ wallet }) {
  return {
    isLoading: wallet.get('isLoading ')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setIsLoading,
      fetchOriginationAverageFees,
      createNewAccount
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDelegateModal);
