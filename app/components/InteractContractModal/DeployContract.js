// @flow
import React, { Component } from 'react';
import TextField from '../TextField';
import CustomTextArea from './CustomTextArea';
import TezosNumericInput from '../TezosNumericInput/';
import { ms } from '../../styles/helpers';
import CustomSelect from '../CustomSelect';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import TezosAmount from '../TezosAmount';
import TezosAddress from '../TezosAddress';
import TezosIcon from '../TezosIcon';
import DeployLedgerConfirmationModal from '../DeployLedgerConfirmationModal';

import { OPERATIONFEE } from '../../constants/LowFeeValue';
import TezosChainFormatArrary from '../../constants/TezosChainFormat';

import { openLinkToBlockExplorer } from '../../utils/general';

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
  ColStorage,
  ChainItemWrapper,
  SelectChainItemWrapper,
  SelectChainRenderWrapper
} from './style';

const utez = 1000000;

type Props = {
  isLoading: boolean,
  isLedger: boolean,
  averageFees: object,
  addresses: List,
  originateContract: () => {},
  onClose: () => {},
  t: () => {}
};

const defaultState = {
  gas: 0,
  storage: 0,
  fee: 50000,
  amount: '',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  michelsonCode: '',
  delegate: '',
  codeFormat: ''
};

class DeployContract extends Component<Props> {
  props: Props;
  state = {
    ...defaultState
  };

  onUseMax = () => {
    const { fee, gas, storage } = this.state;
    const { addresses } = this.props;
    const { balance } = addresses[0];
    const max = balance - fee - gas - storage;
    let amount = '0';
    if (max > 0) {
      amount = (max / utez).toFixed(6);
    }
    this.setState({ amount });
  };

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  onLedgerConfirmation = val => {
    this.setState({ isOpenLedgerConfirm: val });
  };

  openLink = element => openLinkToBlockExplorer(element);

  onChangeFormatType = event =>
    this.setState({ codeFormat: event.target.value });

  onDeployOperation = async () => {
    const {
      originateContract,
      setIsLoading,
      isLedger,
      addresses,
      isLoading,
      onClose
    } = this.props;

    const {
      passPhrase,
      amount,
      gas,
      storage,
      fee,
      michelsonCode,
      parameters,
      delegate,
      codeFormat
    } = this.state;

    const isDisabled =
      isLoading ||
      !amount ||
      (!passPhrase && !isLedger) ||
      !parameters ||
      !michelsonCode;

    if (isDisabled) return;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    const { pkh } = addresses[0];
    const initStorage = JSON.parse(parameters);
    const initCode = JSON.parse(michelsonCode);

    const isOperationCompleted = await originateContract(
      delegate,
      amount,
      fee,
      passPhrase,
      pkh,
      storage,
      gas,
      initCode,
      initStorage,
      codeFormat
    ).catch(err => {
      console.error(err);
      return false;
    });

    this.onLedgerConfirmation(false);
    setIsLoading(false);
    if (isOperationCompleted) {
      onClose();
    }
  };

  render() {
    const {
      amount,
      fee,
      passPhrase,
      isShowedPwd,
      isOpenLedgerConfirm,
      parameters,
      michelsonCode,
      codeFormat
    } = this.state;

    const { isLoading, isLedger, addresses, averageFees, t } = this.props;

    const isDisabled =
      isLoading ||
      !amount ||
      (!passPhrase && !isLedger) ||
      !parameters ||
      !michelsonCode;

    return (
      <MainContainer>
        <TabContainer>
          <InputAddressContainer>
            <CustomTextArea
              label={t('components.interactModal.paste_micheline_code')}
              multiline
              rows={5}
              rowsMax={5}
              onChange={val => this.setState({ michelsonCode: val })}
            />
          </InputAddressContainer>

          <StorageFormatContainer>
            <ColStorage>
              <TextField
                label={t('components.interactModal.initial_storage')}
                onChange={val => this.setState({ parameters: val })}
              />
            </ColStorage>
            <ColFormat>
              <CustomSelect
                label={t('general.nouns.format')}
                value={codeFormat}
                onChange={this.onChangeFormatType}
                renderValue={value => (
                  <SelectChainRenderWrapper>{value}</SelectChainRenderWrapper>
                )}
              >
                {TezosChainFormatArrary.map(format => (
                  <ChainItemWrapper component="div" key={format} value={format}>
                    {format === codeFormat && (
                      <TezosIcon
                        size="14px"
                        color="accent"
                        iconName="checkmark2"
                      />
                    )}
                    <SelectChainItemWrapper>{format}</SelectChainItemWrapper>
                  </ChainItemWrapper>
                ))}
              </CustomSelect>
            </ColFormat>
          </StorageFormatContainer>
          <ParametersContainer>
            <TextField
              label={t('general.verbs.delegate')}
              onChange={val => this.setState({ delegate: val })}
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
                onChange={val => this.setState({ storage: val })}
              />
            </ColContainer>
            <ColContainer>
              <TextField
                type="number"
                label={t('components.interactModal.gas_limit')}
                onChange={val => this.setState({ gas: val })}
              />
            </ColContainer>
          </RowContainer>
          <RowContainer>
            <AmountContainer>
              <TezosNumericInput
                decimalSeparator={t('general.decimal_separator')}
                labelText={t('general.nouns.amount')}
                amount={amount}
                handleAmountChange={val => this.setState({ amount: val })}
              />
              <UseMax onClick={this.onUseMax}>
                {t('general.verbs.use_max')}
              </UseMax>
            </AmountContainer>
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
        </TabContainer>
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
            onClick={this.onDeployOperation}
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
            onCloseClick={() => this.closeLedgerConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </MainContainer>
    );
  }
}

export default DeployContract;
