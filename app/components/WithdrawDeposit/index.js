// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ms } from '../../styles/helpers';
import Button from '../Button/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import WithdrawLedgerConfirmationModal from '../WithdrawLedgerConfirmationModal';
import TezosIcon from '../TezosIcon/';

import fetchAverageFees from '../../reduxContent/generalThunk';
import { withdrawThunk, depositThunk } from '../../reduxContent/invoke/thunks';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { setIsLoading } from '../../reduxContent/wallet/actions';

import { OPERATIONFEE } from '../../constants/LowFeeValue';
import { WITHDRAW } from '../../constants/TabConstants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  position: relative;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AmountContainer = styled.div`
  width: 45%;
  position: relative;
`;

const FeeContainer = styled.div`
  width: 45%;
  display: flex;
  height: 64px;
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

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 40px 15px 0px;
  height: 100px;
  margin-top: auto;
  width: 100%;
`;

const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 0;
`;

const ErrorContainer = styled.div`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.error1};
`;

const WarningIcon = styled(TezosIcon)`
  padding: 0 ${ms(-9)} 0 0;
  position: relative;
  top: 1px;
`;

const utez = 1000000;

type Props = {
  isReady?: boolean,
  isLedger: boolean,
  isLoading: boolean,
  addresses: List,
  balance: number,
  selectedParentHash: string,
  selectedAccountHash: string,
  format: string,
  onSuccess: () => {},
  fetchAverageFees: () => {},
  withdrawThunk?: () => {},
  depositThunk?: () => {},
  setIsLoading: () => {},
  t: () => {}
};

const initialState = {
  fee: 2840,
  averageFees: { low: 1420, medium: 2840, high: 5680 },
  amount: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false
};

class WithdrawDeposit extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    this.mounted = true;
    const { fetchAverageFees } = this.props;
    const averageFees = await fetchAverageFees('transaction');
    if (averageFees.low < OPERATIONFEE) {
      averageFees.low = OPERATIONFEE;
    }
    if (this.mounted) {
      this.setState({
        averageFees,
        fee: averageFees.medium
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onGetMax = () => {
    const { fee } = this.state;
    const { balance, format, addresses } = this.props;
    const max =
      format === WITHDRAW ? balance - 1 : addresses[0].balance - fee - 1;
    const amount = max > 0 ? (max / utez).toFixed(6) : '0';
    this.setState({ amount });
  };

  getBalanceState = amount => {
    const { fee } = this.state;
    const { balance, format, addresses, t } = this.props;
    const realAmount = !amount ? Number(amount) : 0;
    const max = format === WITHDRAW ? balance : addresses[0].balance - fee;

    if (max <= 0 || max < realAmount) {
      return {
        isIssue: true,
        warningMessage: t('components.send.warnings.total_exceeds')
      };
    }

    return {
      isIssue: false,
      warningMessage: ''
    };
  };

  renderError = warningMessage => {
    return (
      <ErrorContainer>
        <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
        {warningMessage}
      </ErrorContainer>
    );
  };

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onInvokeOperation();
    }
  };

  onLedgerConfirmation = val => {
    this.setState({ isOpenLedgerConfirm: val });
  };

  onInvokeOperation = async () => {
    const {
      isLedger,
      selectedParentHash,
      selectedAccountHash,
      format,
      withdrawThunk,
      depositThunk,
      setIsLoading,
      onSuccess
    } = this.props;

    const { amount, fee, passPhrase } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    let operationResult;
    if (format === WITHDRAW) {
      operationResult = await withdrawThunk(
        fee,
        amount,
        passPhrase,
        selectedAccountHash,
        selectedParentHash
      ).catch(err => {
        console.error(err);
        return false;
      });
    } else {
      operationResult = await depositThunk(
        fee,
        amount,
        passPhrase,
        selectedAccountHash,
        selectedParentHash
      ).catch(err => {
        console.error(err);
        return false;
      });
    }

    this.onLedgerConfirmation(false);
    setIsLoading(false);

    if (operationResult) {
      onSuccess();
    }
  };

  render() {
    const {
      amount,
      fee,
      averageFees,
      passPhrase,
      isShowedPwd,
      isOpenLedgerConfirm
    } = this.state;
    const {
      isReady,
      isLoading,
      isLedger,
      selectedAccountHash,
      format,
      t
    } = this.props;
    const { isIssue, warningMessage } = this.getBalanceState(amount);
    const isDisabled =
      !isReady ||
      isLoading ||
      isIssue ||
      amount === '0' ||
      !amount ||
      (!passPhrase && !isLedger);

    const buttonTitle =
      format === WITHDRAW
        ? t('general.verbs.withdraw')
        : t('general.verbs.deposit');
    const error = isIssue ? this.renderError(warningMessage) : '';

    return (
      <Container onKeyDown={event => this.onEnterPress(event.key, isDisabled)}>
        <AmountContainer>
          <TezosNumericInput
            decimalSeparator={t('general.decimal_separator')}
            labelText={t('general.nouns.amount')}
            amount={amount}
            handleAmountChange={val => this.setState({ amount: val })}
            errorText={error}
          />
          <UseMax onClick={this.onGetMax}>{t('general.verbs.use_max')}</UseMax>
        </AmountContainer>
        <RowContainer>
          <FeeContainer>
            <Fees
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              miniFee={OPERATIONFEE}
              onChange={val => this.setState({ fee: val })}
            />
          </FeeContainer>
        </RowContainer>

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
          <InvokeButton
            buttonTheme="primary"
            disabled={isDisabled}
            onClick={this.onInvokeOperation}
          >
            {buttonTitle}
          </InvokeButton>
        </PasswordButtonContainer>
        {isLedger && isOpenLedgerConfirm && (
          <WithdrawLedgerConfirmationModal
            amount={amount}
            fee={fee}
            source={selectedAccountHash}
            open={isOpenLedgerConfirm}
            onCloseClick={() => this.closeLedgerConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLedger: getIsLedger(state),
    isLoading: state.wallet.get('isLoading')
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchAverageFees,
      withdrawThunk,
      depositThunk,
      setIsLoading
    },
    dispatch
  );

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WithdrawDeposit);
