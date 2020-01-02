// @flow
import React, { useState, useEffect } from 'react';
import TextField from '../TextField';
import CustomTextArea from './CustomTextArea';
import TezosNumericInput from '../TezosNumericInput/';
import { ms } from '../../styles/helpers';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import TezosAmount from '../TezosAmount';
import TezosAddress from '../TezosAddress';
import DeployLedgerConfirmationModal from '../DeployLedgerConfirmationModal';
import FormatSelector from '../FormatSelector';

import { OPERATIONFEE } from '../../constants/LowFeeValue';

// import { openLinkToBlockExplorer } from '../../utils/general';

import {
  MainContainer,
  TabContainer,
  InputAddressContainer,
  ParametersContainer,
  DeployAddressContainer,
  DeployAddressLabel,
  DeployAddressContent,
  SpaceBar,
  RowContainer,
  ColContainer,
  AmountContainer,
  FeeContainer,
  PasswordButtonContainer,
  InvokeButton,
  UseMax,
  StorageFormatContainer,
  ColFormat,
  ColStorage
} from './style';

const utez = 1000000;

type Props = {
  isLoading: boolean,
  isLedger: boolean,
  averageFees: object,
  addresses: List,
  enterNum: number,
  originateContract: () => {},
  setIsLoading: () => {},
  onClose: () => {},
  t: () => {}
};

const defaultState = {
  gas: 0,
  storage: 0,
  fee: 10000,
  amount: '0',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  michelsonCode: '',
  delegate: '',
  codeFormat: 'micheline'
};

function DeployContract(props: Props) {
  const {
    isLoading,
    isLedger,
    addresses,
    averageFees,
    enterNum,
    setIsLoading,
    originateContract,
    onClose,
    t
  } = props;

  const [state, setState] = useState(defaultState);
  const {
    amount,
    fee,
    gas,
    storage,
    passPhrase,
    isShowedPwd,
    isOpenLedgerConfirm,
    parameters,
    michelsonCode,
    codeFormat,
    delegate
  } = state;

  const isDisabled =
    isLoading ||
    !amount ||
    (!passPhrase && !isLedger) ||
    !parameters ||
    !michelsonCode;

  function updateState(updatedValues) {
    setState(prevState => {
      return { ...prevState, ...updatedValues };
    });
  }

  function onUseMax() {
    const { balance } = addresses[0];
    const max = balance - fee - gas - storage - 1;
    let amount = '0';
    if (max > 0) {
      amount = (max / utez).toFixed(6);
    }
    updateState({ amount });
  }

  function updatePassPhrase(val) {
    updateState({ passPhrase: val });
  }

  function onLedgerConfirmation(flag) {
    updateState({ isOpenLedgerConfirm: flag });
  }

  // function openLink (element) {
  //   openLinkToBlockExplorer(element);
  // }

  async function onDeployOperation() {
    if (isDisabled) return;
    setIsLoading(true);

    if (isLedger) {
      onLedgerConfirmation(true);
    }

    const { pkh } = addresses[0];

    const isOperationCompleted = await originateContract(
      delegate,
      amount,
      fee,
      passPhrase,
      pkh,
      storage,
      gas,
      michelsonCode,
      parameters,
      codeFormat,
      true
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
      onDeployOperation();
    }
  }, [enterNum]);

  return (
    <MainContainer>
      <TabContainer>
        <InputAddressContainer>
          <CustomTextArea
            label={t('components.interactModal.paste_micheline_code', {
              format: codeFormat
            })}
            multiline
            rows={5}
            rowsMax={5}
            onChange={val => updateState({ michelsonCode: val })}
          />
        </InputAddressContainer>

        <StorageFormatContainer>
          <ColStorage>
            <TextField
              label={t('components.interactModal.initial_storage')}
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
            label={t('general.verbs.delegate')}
            onChange={val => updateState({ delegate: val })}
          />
        </ParametersContainer>

        <DeployAddressContainer>
          <DeployAddressLabel>
            {t('components.interactModal.deploy_from')}
          </DeployAddressLabel>
          <DeployAddressContent>
            <TezosAddress
              address={addresses[0].pkh}
              size="16px"
              color="gray3"
              color2="primary"
            />
            <SpaceBar />
            <TezosAmount
              color="primary"
              size={ms(0.65)}
              amount={addresses[0].balance}
            />
          </DeployAddressContent>
        </DeployAddressContainer>
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
          onClick={onDeployOperation}
        >
          {t('general.verbs.deploy')}
        </InvokeButton>
      </PasswordButtonContainer>
      {isLedger && isOpenLedgerConfirm && (
        <DeployLedgerConfirmationModal
          amount={amount}
          fee={fee}
          source={addresses[0].pkh}
          parameters={parameters}
          open={isOpenLedgerConfirm}
          onCloseClick={() => onLedgerConfirmation(false)}
          isLoading={isLoading}
        />
      )}
    </MainContainer>
  );
}

export default DeployContract;
