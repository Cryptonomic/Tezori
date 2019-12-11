// @flow
import React, { useState, useEffect } from 'react';
import TextField from '../TextField';
import TezosNumericInput from '../TezosNumericInput/';
import { ms } from '../../styles/helpers';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';
import InvokeLedgerConfirmationModal from '../InvokeLedgerConfirmationModal';
import FormatSelector from '../FormatSelector';

import { OPERATIONFEE } from '../../constants/LowFeeValue';
import { openLinkToBlockExplorer } from '../../utils/general';

import {
  MainContainer,
  TabContainer,
  InputAddressContainer,
  ParametersContainer,
  RowContainer,
  ColContainer,
  AmountContainer,
  FeeContainer,
  PasswordButtonContainer,
  InvokeButton,
  UseMax,
  ViewScan,
  LinkIcon,
  StorageFormatContainer,
  ColFormat,
  ColStorage
} from './style';

const utez = 1000000;

type Props = {
  isLoading: boolean,
  isLedger: boolean,
  selectedParentHash: string,
  averageFees: object,
  addresses: List,
  enterNum: number,
  invokeAddress: () => {},
  onClose: () => {},
  setIsLoading: () => {},
  t: () => {}
};

const defaultState = {
  isAddressIssue: false,
  contractAddress: '',
  selectedInvokeAddress: '',
  gas: 0,
  storage: 0,
  fee: 2840,
  amount: '0',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  codeFormat: 'micheline',
  entryPoint: ''
};

function InvokeContract(props: Props) {
  const {
    t,
    isLoading,
    isLedger,
    selectedParentHash,
    averageFees,
    addresses,
    enterNum,
    invokeAddress,
    onClose,
    setIsLoading
  } = props;
  const [state, setState] = useState(() => {
    return {
      ...defaultState,
      selectedInvokeAddress: addresses[0].pkh,
      balance: addresses[0].balance
    };
  });
  const {
    fee,
    gas,
    balance,
    storage,
    amount,
    parameters,
    passPhrase,
    isShowedPwd,
    isOpenLedgerConfirm,
    codeFormat,
    entryPoint,
    isAddressIssue,
    contractAddress,
    selectedInvokeAddress
  } = state;

  const isDisabled =
    isAddressIssue ||
    isLoading ||
    !amount ||
    !contractAddress ||
    (!passPhrase && !isLedger);

  function updateState(updatedValues) {
    setState(prevState => {
      return { ...prevState, ...updatedValues };
    });
  }

  function onUseMax() {
    const max = balance - fee - gas - storage;
    let newAmount = '0';
    if (max > 0) {
      newAmount = (max / utez).toFixed(6);
    }
    updateState({ amount: newAmount });
  }

  // function onChangeInvokeAddress(event) {
  //   const pkh = event.target.value;
  //   const address = addresses.find(address => address.pkh === pkh);
  //   updateState({ selectedInvokeAddress: pkh, balance: address.balance });
  // };

  function updatePassPhrase(val) {
    updateState({ passPhrase: val });
  }

  function onLedgerConfirmation(val) {
    updateState({ isOpenLedgerConfirm: val });
  }

  function openLink(link) {
    openLinkToBlockExplorer(link);
  }

  async function onInvokeOperation() {
    if (isDisabled) return;
    setIsLoading(true);
    if (isLedger) {
      onLedgerConfirmation(true);
    }

    const isOperationCompleted = await invokeAddress(
      contractAddress,
      fee,
      amount,
      storage,
      gas,
      parameters,
      passPhrase,
      selectedInvokeAddress,
      selectedParentHash,
      entryPoint,
      codeFormat
    ).catch(err => {
      console.error(err);
      return false;
    });

    onLedgerConfirmation(false);
    setIsLoading(false);
    if (isOperationCompleted) {
      onClose();
    }
  }

  useEffect(() => {
    updateState({ fee: averageFees.medium });
  }, [averageFees]);

  useEffect(() => {
    if (enterNum !== 0) {
      onInvokeOperation();
    }
  }, [enterNum]);

  return (
    <MainContainer>
      <TabContainer>
        <InputAddressContainer>
          <InputAddress
            operationType="invoke"
            labelText={t('components.interactModal.smart_address')}
            onAddressChange={val => updateState({ contractAddress: val })}
            onIssue={status => updateState({ isAddressIssue: status })}
          />
          {!isAddressIssue && contractAddress && (
            <React.Fragment>
              <ViewScan onClick={() => openLink(contractAddress)}>
                {t('components.interactModal.view_scan')}
              </ViewScan>
              <LinkIcon
                iconName="new-window"
                size={ms(-1)}
                color="primary"
                onClick={() => openLink(contractAddress)}
              />
            </React.Fragment>
          )}
        </InputAddressContainer>
        <StorageFormatContainer>
          <ColStorage>
            <TextField
              label={t('components.interactModal.parameters')}
              onChange={val => updateState({ parameters: val })}
            />
          </ColStorage>
          <ColFormat>
            <FormatSelector
              value={codeFormat}
              onChange={val => updateState({ codeFormat: val })}
            />
          </ColFormat>
        </StorageFormatContainer>
        <ParametersContainer>
          <TextField
            label={t('components.interactModal.entry_point')}
            onChange={val => updateState({ entryPoint: val })}
          />
        </ParametersContainer>

        <RowContainer>
          <ColContainer>
            <TextField
              type="number"
              label={t('components.interactModal.storage_limit')}
              onChange={val => updateState({ storage: val })}
            />
          </ColContainer>
          <ColContainer>
            <TextField
              type="number"
              label={t('components.interactModal.gas_limit')}
              onChange={val => updateState({ gas: val })}
            />
          </ColContainer>
        </RowContainer>
        <RowContainer>
          <AmountContainer>
            <TezosNumericInput
              decimalSeparator={t('general.decimal_separator')}
              labelText={t('general.nouns.amount')}
              amount={amount}
              handleAmountChange={val => updateState({ amount: val })}
            />
            <UseMax onClick={onUseMax}>{t('general.verbs.use_max')}</UseMax>
          </AmountContainer>
          <FeeContainer>
            <Fees
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              miniFee={OPERATIONFEE}
              onChange={val => updateState({ fee: val })}
            />
          </FeeContainer>
        </RowContainer>
      </TabContainer>
      <PasswordButtonContainer>
        {!isLedger && (
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={passPhrase}
            changFunc={updatePassPhrase}
            containerStyle={{ width: '60%', marginTop: '10px' }}
            onShow={() => updateState({ isShowedPwd: !isShowedPwd })}
          />
        )}
        <InvokeButton
          buttonTheme="primary"
          disabled={isDisabled}
          onClick={onInvokeOperation}
        >
          {t('general.verbs.invoke')}
        </InvokeButton>
      </PasswordButtonContainer>
      {isLedger && isOpenLedgerConfirm && (
        <InvokeLedgerConfirmationModal
          amount={amount}
          fee={fee}
          parameters={parameters}
          storage={storage}
          address={contractAddress}
          source={selectedInvokeAddress}
          open={isOpenLedgerConfirm}
          onCloseClick={() => onLedgerConfirmation(false)}
          isLoading={isLoading}
        />
      )}
    </MainContainer>
  );
}

export default InvokeContract;
