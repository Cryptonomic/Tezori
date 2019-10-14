// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '../Button/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import TextField from '../TextField';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import DelegateLedgerConfirmationModal from '../DelegateLedgerConfirmationModal';
import WithdrawLedgerConfirmationModal from '../WithdrawLedgerConfirmationModal';

import fetchAverageFees from '../../reduxContent/generalThunk';
import { withdrawThunk } from '../../reduxContent/invoke/thunks';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { delegate } from '../../reduxContent/delegate/thunks';

import { OPERATIONFEE } from '../../constants/LowFeeValue';

const InvokeType = {
  DELEGATE: 'delegate',
  WITHDRAW: 'withdraw',
  DEPOSIT: 'deposit'
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px 20px 20px;
  position: relative;
`;

export const InvokeAddressContainer = styled.div`
  width: 100%;
  display: flex;
  height: 64px;
  margin-top: 20px;
`;

export const ParametersContainer = styled.div`
  width: 100%;
  height: 64px;
`;

export const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }
`;

export const SpaceBar = styled.div`
  height: 16px;
  width: 2px;
  margin: 0 4px 0 7px;
  background-color: ${({ theme: { colors } }) => colors.primary};
`;

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const ColContainer = styled.div`
  width: 45%;
`;

export const AmountContainer = styled.div`
  width: 45%;
  position: relative;
`;

export const FeeContainer = styled.div`
  width: 45%;
  display: flex;
  height: 64px;
`;

export const UseMax = styled.div`
  position: absolute;
  right: 23px;
  top: 24px;
  font-size: 12px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;

export const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 40px 15px 0px;
  height: 100px;
  margin-top: auto;
  width: 100%;
`;

export const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 0;
`;

export const RadioLabel = styled(FormControlLabel)`
  &&& {
    span[class*='MuiFormControlLabel-label'] {
      font-size: 20px;
      color: ${({ theme: { colors } }) => colors.primary};
      font-weight: 300;
      letter-spacing: 1px;
    }
  }
`;

export const RadioWrapper = styled(Radio)`
  &&& {
    &[class*='checked'] {
      color: ${({ theme: { colors } }) => colors.accent};
    }
  }
`;

const utez = 1000000;

type Props = {
  isReady?: boolean,
  isLedger: boolean,
  isLoading: boolean,
  balance: number,
  selectedParentHash: string,
  selectedAccountHash: string,
  onSuccess: () => {},
  fetchAverageFees: () => {},
  delegate?: () => {},
  withdrawThunk?: () => {},
  setIsLoading: () => {},
  t: () => {}
};

const initialState = {
  fee: 50000,
  averageFees: { low: 1420, medium: 2840, high: 5680 },
  delegateAddress: '',
  amount: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  invokeFormat: 'delegate'
};

class InvokeManager extends Component<Props> {
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
        averageFees
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onMaxWithdraw = () => {
    const { balance } = this.props;
    let amount = '0';
    if (balance > 0) {
      amount = (balance / utez).toFixed(6);
    }
    this.setState({ amount });
  };

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onInvokeOperation();
    }
  };

  handleChangeFormat = event => {
    this.setState({ invokeFormat: event.target.value });
  };

  renderContent = format => {
    const { t } = this.props;
    const { amount } = this.state;
    if (format === InvokeType.DELEGATE) {
      return (
        <ParametersContainer>
          <TextField
            label={t('general.nouns.delegate')}
            onChange={val => this.setState({ delegateAddress: val })}
          />
        </ParametersContainer>
      );
    }

    return (
      <AmountContainer>
        <TezosNumericInput
          decimalSeparator={t('general.decimal_separator')}
          labelText={t('general.nouns.amount')}
          amount={amount}
          handleAmountChange={val => this.setState({ amount: val })}
        />
        <UseMax onClick={this.onMaxWithdraw}>
          {t('general.verbs.use_max')}
        </UseMax>
      </AmountContainer>
    );
  };

  renderConfirmationModal = format => {
    const { isLoading, selectedAccountHash } = this.props;
    const { fee, delegateAddress, isOpenLedgerConfirm, amount } = this.state;
    if (format === InvokeType.DELEGATE) {
      return (
        <DelegateLedgerConfirmationModal
          fee={fee}
          address={delegateAddress}
          source={selectedAccountHash}
          open={isOpenLedgerConfirm}
          onCloseClick={() => this.onOpenLedgerConfirmation(false)}
          isLoading={isLoading}
        />
      );
    }
    return (
      <WithdrawLedgerConfirmationModal
        amount={amount}
        fee={fee}
        source={selectedAccountHash}
        open={isOpenLedgerConfirm}
        onCloseClick={() => this.closeLedgerConfirmation(false)}
        isLoading={isLoading}
      />
    );
  };

  onLedgerConfirmation = val => {
    this.setState({ isOpenLedgerConfirm: val });
  };

  onInvokeOperation = async () => {
    const {
      isLedger,
      selectedParentHash,
      selectedAccountHash,
      delegate,
      withdrawThunk,
      setIsLoading,
      onSuccess
    } = this.props;

    const {
      amount,
      fee,
      passPhrase,
      invokeFormat,
      delegateAddress
    } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    let operationResult;
    if (invokeFormat === InvokeType.DELEGATE) {
      operationResult = await delegate(
        delegateAddress,
        fee,
        passPhrase,
        selectedAccountHash,
        selectedParentHash
      ).catch(err => {
        console.error(err);
        return false;
      });
    } else {
      operationResult = await withdrawThunk(
        fee,
        amount,
        passPhrase,
        selectedAccountHash,
        selectedParentHash,
        invokeFormat === InvokeType.WITHDRAW
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
      invokeFormat,
      delegateAddress,
      isOpenLedgerConfirm
    } = this.state;
    const { isReady, isLoading, isLedger, t } = this.props;
    const isDisabled =
      !isReady ||
      isLoading ||
      (!delegateAddress && invokeFormat === InvokeType.DELEGATE) ||
      (!amount && invokeFormat !== InvokeType.DELEGATE) ||
      (!passPhrase && !isLedger);

    return (
      <Container onKeyDown={event => this.onEnterPress(event.key, isDisabled)}>
        <RadioGroup
          aria-label="position"
          name="position"
          value={invokeFormat}
          onChange={this.handleChangeFormat}
          row
        >
          <RadioLabel
            value={InvokeType.DELEGATE}
            control={<RadioWrapper />}
            label={t('general.verbs.delegate')}
            labelPlacement="end"
          />
          <RadioLabel
            value={InvokeType.WITHDRAW}
            control={<RadioWrapper />}
            label={t('general.verbs.withdraw')}
            labelPlacement="end"
          />
          <RadioLabel
            value={InvokeType.DEPOSIT}
            control={<RadioWrapper />}
            label={t('general.verbs.deposit')}
            labelPlacement="end"
          />
        </RadioGroup>
        {this.renderContent(invokeFormat)}
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
            {t('general.verbs.invoke')}
          </InvokeButton>
        </PasswordButtonContainer>
        {isLedger &&
          isOpenLedgerConfirm &&
          this.renderConfirmationModal(invokeFormat)}
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
      delegate,
      withdrawThunk,
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
)(InvokeManager);
