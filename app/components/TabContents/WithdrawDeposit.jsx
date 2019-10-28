// @flow
import React, { useState, useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import WithdrawLedgerConfirmationModal from '../WithdrawLedgerConfirmationModal';
import InputError from './InputError';

import fetchAverageFees from '../../reduxContent/generalThunk';
import { withdrawThunk, depositThunk } from '../../reduxContent/invoke/thunks';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { setIsLoading } from '../../reduxContent/wallet/actions';

import { OPERATIONFEE } from '../../constants/LowFeeValue';
import { WITHDRAW } from '../../constants/TabConstants';

import {
  Container,
  AmountContainer,
  FeeContainer,
  UseMax,
  PasswordButtonContainer,
  InvokeButton
} from './style';

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

function WithdrawDeposit(props: Props) {
  const [fee, setFee] = useState(50000);
  const [averageFees, setAverageFees] = useState({
    low: 1420,
    medium: 2840,
    high: 5680
  });
  const [amount, setAmount] = useState('');
  const [passPhrase, setPassPhrase] = useState('');
  const [isShowedPwd, setIsShowedPwd] = useState(false);
  const [isOpenLedgerConfirm, setIsOpenLedgerConfirm] = useState(false);
  const {
    isReady,
    isLoading,
    isLedger,
    selectedAccountHash,
    selectedParentHash,
    balance,
    format,
    addresses,
    fetchAverageFees,
    withdrawThunk,
    depositThunk,
    setIsLoading,
    onSuccess,
    t
  } = props;

  async function getFees() {
    const averageFees = await fetchAverageFees('transaction');
    if (averageFees.low < OPERATIONFEE) {
      averageFees.low = OPERATIONFEE;
      setAverageFees(averageFees);
    }
  }

  useEffect(() => {
    getFees();
  }, [selectedAccountHash]);

  useEffect(() => {
    setAmount('');
  }, [format]);

  function onGetMax() {
    const max = format === WITHDRAW ? balance : addresses[0].balance - fee;
    let amount = '0';
    if (max > 0) {
      amount = (max / utez).toFixed(6);
    }
    setAmount(amount);
  }

  function getBalanceState() {
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
  }

  function onLedgerConfirmation(val) {
    setIsOpenLedgerConfirm(val);
  }

  async function onInvokeOperation() {
    setIsLoading(true);

    if (isLedger) {
      onLedgerConfirmation(true);
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

    onLedgerConfirmation(false);
    setIsLoading(false);

    if (operationResult) {
      onSuccess();
    }
  }

  function onEnterPress(keyVal, isDisabled) {
    if (keyVal === 'Enter' && !isDisabled) {
      onInvokeOperation();
    }
  }

  const { isIssue, warningMessage } = getBalanceState();
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
  const error = isIssue ? <InputError error={warningMessage} /> : '';

  return (
    <Container onKeyDown={event => onEnterPress(event.key, isDisabled)}>
      <AmountContainer>
        <TezosNumericInput
          decimalSeparator={t('general.decimal_separator')}
          labelText={t('general.nouns.amount')}
          amount={amount}
          handleAmountChange={val => setAmount(val)}
          errorText={error}
        />
        <UseMax onClick={onGetMax}>{t('general.verbs.use_max')}</UseMax>
      </AmountContainer>
      <FeeContainer>
        <Fees
          low={averageFees.low}
          medium={averageFees.medium}
          high={averageFees.high}
          fee={fee}
          miniFee={OPERATIONFEE}
          onChange={val => setFee(val)}
        />
      </FeeContainer>

      <PasswordButtonContainer>
        {!isLedger && (
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={passPhrase}
            changFunc={passPhrase => setPassPhrase(passPhrase)}
            containerStyle={{ width: '60%', marginTop: '10px' }}
            onShow={() => setIsShowedPwd(!isShowedPwd)}
          />
        )}
        <InvokeButton
          buttonTheme="primary"
          disabled={isDisabled}
          onClick={() => onInvokeOperation()}
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
          onCloseClick={() => onLedgerConfirmation(false)}
          isLoading={isLoading}
        />
      )}
    </Container>
  );
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
