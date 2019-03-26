// @flow
import React, { Component } from 'react';
// import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '../TextField';
import TezosNumericInput from '../TezosNumericInput/';

// import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import Button from '../Button';
import Loader from '../Loader/';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';
import CustomSelect from '../CustomSelect';
import TezosAmount from '../TezosAmount';
import TezosAddress from '../TezosAddress';
import InvokeLedgerConfirmationModal from '../InvokeLedgerConfirmationModal';
import DeployLedgerConfirmationModal from '../DeployLedgerConfirmationModal';

import { originateContract } from '../../reduxContent/originate/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import fetchAverageFees from '../../reduxContent/generalThunk';
import invokeAddress from '../../reduxContent/invokeAddress/thunks';
import { OPERATIONFEE } from '../../constants/LowFeeValue';

import { openLinkToBlockExplorer } from '../../utils/general';

const ModalWrapper = styled(Modal)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  outline: none;
  position: relative;
  min-width: 671px;
  max-width: 750px;
`;

const CloseIconWrapper = styled(CloseIcon)`
  &&& {
    fill: ${({ theme: { colors } }) => colors.white};
    cursor: pointer;
    height: 20px;
    width: 20px;
    position: absolute;
    top: 23px;
    right: 23px;
  }
`;

const ModalTitle = styled.div`
  padding: 27px 36px;
  font-size: 24px;
  letter-spacing: 1px;
  line-height: 34px;
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.white};
  width: 100%;
  background-color: ${({ theme: { colors } }) => colors.accent};
`;

const Tab = styled(Button)`
  background: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.accent};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.primary : colors.white};
  text-align: center;
  font-weight: 500;
  padding: ${ms(-1)} ${ms(1)};
  border-radius: 0;
  flex: 1;
`;

const TabList = styled.div`
  background-color: ${({ theme: { colors } }) => colors.accent};
  display: flex;
`;

const TabContainer = styled.div`
  width: 100%;
  padding: 50px 40px 30px 30px;
`;

const InputAddressContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InvokeAddressContainer = styled.div`
  width: 100%;
  display: flex;
  height: 64px;
`;

const ParametersContainer = styled.div`
  width: 100%;
  height: 64px;
`;

const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
  }
`;

const SpaceBar = styled.div`
  height: 16px;
  width: 2px;
  margin: 0 4px 0 7px;
  background-color: ${({ theme: { colors } }) => colors.primary};
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ColContainer = styled.div`
  width: 45%;
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

const ViewScan = styled.div`
  position: absolute;
  right: 22px;
  top: 41px;
  font-size: 10px;
  font-weight: 500;
  display: block;
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
`;

const LinkIcon = styled(TezosIcon)`
  position: absolute;
  right: 0;
  top: 41px;
  cursor: pointer;
`;

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 40px 15px 40px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
  height: 100px;
`;

const InvokeButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
`;

const DeployAddressContainer = styled.div`
  width: 100%;
  height: 64px;
`;

const DeployAddressLabel = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.38);
`;
const DeployAddressContent = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const utez = 1000000;

const tabs = [
  { id: 'invoke', name: 'components.interactModal.invoke_contract' },
  { id: 'deploy', name: 'components.interactModal.deploy_contract' }
];

type Props = {
  isLoading: boolean,
  selectedParentHash: string,
  invokeAddress: () => {},
  originateContract: () => {},
  fetchAverageFees: () => {},
  addresses: List,
  open: boolean,
  onCloseClick: () => {},
  t: () => {},
  isLedger: boolean
};

const defaultState = {
  activeTab: 'invoke',
  isAddressIssue: false,
  smartAddress: '',
  selectedInvokeAddress: '',
  gas: 0,
  storage: 0,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  },
  fee: 1420,
  amount: '',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  gas1: 0,
  storage1: 0,
  fee1: 1420,
  amount1: '',
  parameters1: '',
  michelsonCode: '',
  isOpenLedgerConfirm1: false
};

class InteractContractModal extends Component<Props> {
  props: Props;
  state = {
    ...defaultState,
    selectedInvokeAddress: this.props.addresses[0].pkh,
    balance: this.props.addresses[0].balance
  };

  async componentDidUpdate(prevProps) {
    const { open, fetchAverageFees } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchAverageFees('transaction');
      if (averageFees.low < OPERATIONFEE) {
        averageFees.low = OPERATIONFEE;
      }
      const fee = averageFees.low;
      this.setState({
        averageFees,
        fee
      }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  onUseMax = () => {
    const { fee, gas, balance, storage } = this.state;
    const max = balance - fee - gas - storage;
    let amount = '0';
    if (max > 0) {
      amount = (max / utez).toFixed(6);
    }
    this.setState({ amount });
  };

  onUseMax1 = () => {
    const { fee1, gas1, storage1 } = this.state;
    const { addresses } = this.props;
    const { balance } = addresses[0];
    const max = balance - fee1 - gas1 - storage1;
    let amount1 = '0';
    if (max > 0) {
      amount1 = (max / utez).toFixed(6);
    }
    this.setState({ amount1 });
  };

  onCloseClick = () => {
    const { onCloseClick, addresses } = this.props;
    this.setState({
      ...defaultState,
      selectedInvokeAddress: addresses[0].pkh,
      balance: addresses[0].balance
    });
    onCloseClick();
  };

  onSetTab = activeTab => {
    this.setState({ activeTab });
  };

  onChangeInvokeAddress = event => {
    const { addresses } = this.props;
    const pkh = event.target.value;
    const address = addresses.find(address => address.pkh === pkh);
    this.setState({ selectedInvokeAddress: pkh, balance: address.balance });
  };

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  onLedgerConfirmation = val => {
    const { activeTab } = this.state;
    if (activeTab === 'invoke') {
      this.setState({ isOpenLedgerConfirm: val });
    } else {
      this.setState({ isOpenLedgerConfirm1: val });
    }
  };

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onOperation();
    }
  };

  openLink = element => openLinkToBlockExplorer(element);

  onOperation = async () => {
    const {
      invokeAddress,
      originateContract,
      selectedParentHash,
      setIsLoading,
      isLedger,
      addresses
    } = this.props;

    const {
      activeTab,
      smartAddress,
      amount,
      fee,
      storage,
      gas,
      parameters,
      selectedInvokeAddress,
      passPhrase,
      amount1,
      gas1,
      storage1,
      fee1,
      michelsonCode,
      parameters1
    } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    let isOperationCompleted = false;
    if (activeTab === 'invoke') {
      const realParams = parameters ? JSON.parse(parameters) : null;
      isOperationCompleted = await invokeAddress(
        smartAddress,
        fee,
        amount,
        storage,
        gas,
        realParams,
        passPhrase,
        selectedInvokeAddress,
        selectedParentHash
      ).catch(err => {
        console.error(err);
        return false;
      });
    } else {
      const { pkh } = addresses[0];
      const initStorage = parameters1 ? JSON.parse(parameters1) : {};
      const initCode = michelsonCode ? JSON.parse(michelsonCode) : [];

      isOperationCompleted = await originateContract(
        undefined,
        amount1,
        fee1,
        passPhrase,
        pkh,
        storage1,
        gas1,
        initCode,
        initStorage
      ).catch(err => {
        console.error(err);
        return false;
      });
    }

    this.onLedgerConfirmation(false);
    setIsLoading(false);
    if (isOperationCompleted) {
      this.onCloseClick();
    }
  };

  render() {
    const {
      amount,
      activeTab,
      isAddressIssue,
      selectedInvokeAddress,
      averageFees,
      fee,
      smartAddress,
      passPhrase,
      isShowedPwd,
      isOpenLedgerConfirm,
      parameters,
      fee1,
      amount1,
      isOpenLedgerConfirm1
    } = this.state;
    const { isLoading, isLedger, open, addresses, t } = this.props;
    const disabled0 =
      isAddressIssue ||
      isLoading ||
      !amount ||
      !smartAddress ||
      (!passPhrase && !isLedger);

    const disabled1 = isLoading || !amount1 || (!passPhrase && !isLedger);
    const isDisabled = activeTab === 'invoke' ? disabled0 : disabled1;
    const buttonTxt =
      activeTab === 'invoke'
        ? t('general.verbs.invoke')
        : t('general.verbs.deploy');
    return (
      <ModalWrapper
        open={open}
        onKeyDown={event => this.onEnterPress(event.key, isDisabled)}
      >
        <ModalContainer>
          <CloseIconWrapper onClick={this.onCloseClick} />
          <ModalTitle>{t('components.interactModal.title')}</ModalTitle>
          <TabList>
            {tabs.map(tab => {
              return (
                <Tab
                  isActive={activeTab === tab.id}
                  key={tab.id}
                  buttonTheme="plain"
                  onClick={() => this.onSetTab(tab.id)}
                >
                  {t(tab.name)}
                </Tab>
              );
            })}
          </TabList>
          {activeTab === 'invoke' ? (
            <TabContainer>
              <InputAddressContainer>
                <InputAddress
                  addressType="send"
                  labelText={t('components.interactModal.smart_address')}
                  changeDelegate={val => this.setState({ smartAddress: val })}
                  onIssue={status => this.setState({ isAddressIssue: status })}
                />
                {!isAddressIssue && smartAddress && (
                  <React.Fragment>
                    <ViewScan onClick={() => this.openLink(smartAddress)}>
                      {t('components.interactModal.view_scan')}
                    </ViewScan>
                    <LinkIcon
                      iconName="new-window"
                      size={ms(-1)}
                      color="primary"
                      onClick={() => this.openLink(smartAddress)}
                    />
                  </React.Fragment>
                )}
              </InputAddressContainer>
              <InvokeAddressContainer>
                <CustomSelect
                  label={t('components.interactModal.invoke_from')}
                  value={selectedInvokeAddress}
                  onChange={this.onChangeInvokeAddress}
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
              <ParametersContainer>
                <TextField
                  label={t('components.interactModal.parameters')}
                  onChange={val => this.setState({ parameters: val })}
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
          ) : (
            <TabContainer>
              <InputAddressContainer>
                <TextField
                  label={t('components.interactModal.paste_michelson_code')}
                  multiline
                  rows={5}
                  rowsMax={5}
                  onChange={val => this.setState({ michelsonCode: val })}
                />
              </InputAddressContainer>

              <ParametersContainer>
                <TextField
                  label={t('components.interactModal.initial_storage')}
                  onChange={val => this.setState({ parameters1: val })}
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
                    onChange={val => this.setState({ storage1: val })}
                  />
                </ColContainer>
                <ColContainer>
                  <TextField
                    type="number"
                    label={t('components.interactModal.gas_limit')}
                    onChange={val => this.setState({ gas1: val })}
                  />
                </ColContainer>
              </RowContainer>
              <RowContainer>
                <AmountContainer>
                  <TezosNumericInput
                    decimalSeparator={t('general.decimal_separator')}
                    labelText={t('general.nouns.amount')}
                    amount={amount1}
                    handleAmountChange={val => this.setState({ amount1: val })}
                  />
                  <UseMax onClick={this.onUseMax1}>
                    {t('general.verbs.use_max')}
                  </UseMax>
                </AmountContainer>
                <FeeContainer>
                  <Fees
                    low={averageFees.low}
                    medium={averageFees.medium}
                    high={averageFees.high}
                    fee={fee1}
                    miniFee={OPERATIONFEE}
                    onChange={val => this.setState({ fee1: val })}
                  />
                </FeeContainer>
              </RowContainer>
            </TabContainer>
          )}

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
              onClick={this.onOperation}
            >
              {buttonTxt}
            </InvokeButton>
          </PasswordButtonContainer>
          {isLoading && <Loader />}
          {isLedger && isOpenLedgerConfirm && (
            <InvokeLedgerConfirmationModal
              amount={amount}
              fee={fee}
              parameters={parameters}
              address={smartAddress}
              source={selectedInvokeAddress}
              open={isOpenLedgerConfirm}
              onCloseClick={() => this.closeLedgerConfirmation(false)}
              isLoading={isLoading}
            />
          )}
          {isLedger && isOpenLedgerConfirm1 && (
            <DeployLedgerConfirmationModal
              amount={amount1}
              fee={fee1}
              source={addresses[0].pkh}
              open={isOpenLedgerConfirm1}
              onCloseClick={() => this.closeLedgerConfirmation(false)}
              isLoading={isLoading}
            />
          )}
        </ModalContainer>
      </ModalWrapper>
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
      fetchAverageFees,
      invokeAddress,
      originateContract
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InteractContractModal);
