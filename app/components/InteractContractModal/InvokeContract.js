// @flow
import React, { Component } from 'react';
import TextField from '../TextField';
import TezosNumericInput from '../TezosNumericInput/';
import { ms } from '../../styles/helpers';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';
import CustomSelect from '../CustomSelect';
import TezosAmount from '../TezosAmount';
import TezosAddress from '../TezosAddress';
import TezosIcon from '../TezosIcon';
import InvokeLedgerConfirmationModal from '../InvokeLedgerConfirmationModal';
import { OPERATIONFEE } from '../../constants/LowFeeValue';
import TezosChainFormatArrary from '../../constants/TezosChainFormat';

import { openLinkToBlockExplorer } from '../../utils/general';

import {
  MainContainer,
  TabContainer,
  InputAddressContainer,
  ParametersContainer,
  SpaceBar,
  RowContainer,
  ColContainer,
  AmountContainer,
  FeeContainer,
  PasswordButtonContainer,
  InvokeButton,
  UseMax,
  ViewScan,
  LinkIcon,
  InvokeAddressContainer,
  ItemWrapper,
  SelectRenderWrapper,
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
  selectedParentHash: string,
  averageFees: object,
  addresses: List,
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
  fee: 50000,
  amount: '',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  codeFormat: '',
  entryPoint: ''
};

class InvokeContract extends Component<Props> {
  props: Props;
  state = {
    ...defaultState,
    selectedInvokeAddress: this.props.addresses[0].pkh,
    balance: this.props.addresses[0].balance
  };

  onUseMax = () => {
    const { fee, gas, balance, storage } = this.state;
    const max = balance - fee - gas - storage;
    let amount = '0';
    if (max > 0) {
      amount = (max / utez).toFixed(6);
    }
    this.setState({ amount });
  };

  onChangeInvokeAddress = event => {
    const { addresses } = this.props;
    const pkh = event.target.value;
    const address = addresses.find(address => address.pkh === pkh);
    this.setState({ selectedInvokeAddress: pkh, balance: address.balance });
  };

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  onLedgerConfirmation = val => {
    this.setState({ isOpenLedgerConfirm: val });
  };

  openLink = element => openLinkToBlockExplorer(element);

  onChangeFormatType = event =>
    this.setState({ codeFormat: event.target.value });

  onInvokeOperation = async () => {
    const {
      isLedger,
      selectedParentHash,
      invokeAddress,
      isLoading,
      setIsLoading,
      onClose
    } = this.props;

    const {
      contractAddress,
      amount,
      fee,
      storage,
      gas,
      parameters,
      selectedInvokeAddress,
      passPhrase,
      isAddressIssue,
      entryPoint,
      codeFormat
    } = this.state;

    const isDisabled =
      isAddressIssue ||
      isLoading ||
      !amount ||
      !contractAddress ||
      (!passPhrase && !isLedger);

    if (isDisabled) return;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    const userParams = parameters ? JSON.parse(parameters) : null;
    const isOperationCompleted = await invokeAddress(
      contractAddress,
      fee,
      amount,
      storage,
      gas,
      userParams,
      passPhrase,
      selectedInvokeAddress,
      selectedParentHash,
      entryPoint,
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
      isAddressIssue,
      selectedInvokeAddress,
      fee,
      contractAddress,
      passPhrase,
      isShowedPwd,
      isOpenLedgerConfirm,
      parameters,
      storage,
      codeFormat
    } = this.state;
    const { isLoading, isLedger, addresses, averageFees, t } = this.props;
    const isDisabled =
      isAddressIssue ||
      isLoading ||
      !amount ||
      !contractAddress ||
      (!passPhrase && !isLedger);

    return (
      <MainContainer>
        <TabContainer>
          <InputAddressContainer>
            <InputAddress
              addressType="invoke"
              labelText={t('components.interactModal.smart_address')}
              changeDelegate={val => this.setState({ contractAddress: val })}
              onIssue={status => this.setState({ isAddressIssue: status })}
            />
            {!isAddressIssue && contractAddress && (
              <React.Fragment>
                <ViewScan onClick={() => this.openLink(contractAddress)}>
                  {t('components.interactModal.view_scan')}
                </ViewScan>
                <LinkIcon
                  iconName="new-window"
                  size={ms(-1)}
                  color="primary"
                  onClick={() => this.openLink(contractAddress)}
                />
              </React.Fragment>
            )}
          </InputAddressContainer>
          <InvokeAddressContainer>
            <CustomSelect
              label={t('components.interactModal.invoke_from')}
              value={selectedInvokeAddress}
              onChange={this.onChangeInvokeAddress}
              renderValue={value => {
                const address = addresses.find(
                  address => address.pkh === value
                );
                return (
                  <SelectRenderWrapper>
                    <TezosAddress
                      address={address.pkh}
                      size="16px"
                      color="gray3"
                      color2="primary"
                    />
                    <SpaceBar />
                    <TezosAmount
                      color="primary"
                      size={ms(0.65)}
                      amount={address.balance}
                    />
                  </SelectRenderWrapper>
                );
              }}
            >
              {addresses.map(address => (
                <ItemWrapper
                  component="div"
                  key={address.pkh}
                  value={address.pkh}
                >
                  <TezosAddress
                    address={address.pkh}
                    size="16px"
                    color="gray3"
                    color2="primary"
                  />
                  <SpaceBar />
                  <TezosAmount
                    color="primary"
                    size={ms(0.65)}
                    amount={address.balance}
                  />
                </ItemWrapper>
              ))}
            </CustomSelect>
          </InvokeAddressContainer>
          <StorageFormatContainer>
            <ColStorage>
              <TextField
                label={t('components.interactModal.parameters')}
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
              label={t('components.interactModal.entry_point')}
              onChange={val => this.setState({ entryPoint: val })}
            />
          </ParametersContainer>

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
            onClick={this.onInvokeOperation}
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
            onCloseClick={() => this.closeLedgerConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </MainContainer>
    );
  }
}

export default InvokeContract;
