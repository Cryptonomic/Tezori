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

import invokeAddress from '../../reduxContent/InvokeAddress/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import fetchAverageFees from '../../reduxContent/generalThunk';
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

const utez = 1000000;

const tabs = [
  { id: 'invoke', name: 'components.interactModal.invoke_contract' },
  { id: 'deploy', name: 'components.interactModal.deploy_contract' }
];

type Props = {
  isLoading: boolean,
  selectedParentHash: string,
  invokeAddress: () => {},
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
  isOpenLedgerConfirm: false
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
    if (max > 0) {
      const amount = (max / utez).toFixed(6);
      this.setState({ amount });
    } else {
      const amount = '0';
      this.setState({ amount });
    }
  };

  changeAmount = amount => this.setState({ amount });

  changeFee = fee => this.setState({ fee });

  onCloseClick = () => {
    const { onCloseClick } = this.props;
    this.setState({ ...defaultState });
    onCloseClick();
  };

  onSetTab = activeTab => {
    this.setState({ activeTab });
  };

  changeSmartAddress = address => this.setState({ smartAddress: address });

  changeGasLimit = gas => this.setState({ gas });

  changeStorageLimit = storage => this.setState({ storage });

  onChangeInvokeAddress = event => {
    const { addresses } = this.props;
    const pkh = event.target.value;
    const address = addresses.find(address => address.pkh === pkh);
    this.setState({ selectedInvokeAddress: pkh, balance: address.balance });
  };

  onChangeParameters = parameters => this.setState({ parameters });

  updatePassPhrase = passPhrase => this.setState({ passPhrase });

  openLedgerConfirmation = () => this.setState({ isOpenLedgerConfirm: true });
  closeLedgerConfirmation = () => this.setState({ isOpenLedgerConfirm: false });

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onInvokeAddress();
    }
  };

  openLink = element => openLinkToBlockExplorer(element);

  onInvokeAddress = async () => {
    const {
      invokeAddress,
      selectedParentHash,
      setIsLoading,
      isLedger
    } = this.props;

    const {
      smartAddress,
      amount,
      fee,
      storage,
      gas,
      parameters,
      selectedInvokeAddress,
      passPhrase
    } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.openLedgerConfirmation();
    }

    const isInvoked = await invokeAddress(
      smartAddress,
      fee,
      amount,
      storage,
      gas,
      parameters,
      passPhrase,
      selectedInvokeAddress,
      selectedParentHash
    ).catch(err => {
      console.error(err);
      return false;
    });
    this.setState({ isOpenLedgerConfirm: false });
    setIsLoading(false);
    if (isInvoked) {
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
      parameters
    } = this.state;
    const { isLoading, isLedger, open, addresses, t } = this.props;
    const isDisabled =
      isAddressIssue ||
      isLoading ||
      !amount ||
      !smartAddress ||
      (!passPhrase && !isLedger);
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
          <TabContainer>
            <InputAddressContainer>
              <InputAddress
                addressType="send"
                labelText={t('components.interactModal.smart_address')}
                changeDelegate={this.changeSmartAddress}
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
                onChange={this.onChangeParameters}
              />
            </ParametersContainer>
            <RowContainer>
              <ColContainer>
                <TextField
                  type="number"
                  label={t('components.interactModal.storage_limit')}
                  onChange={this.changeStorageLimit}
                />
              </ColContainer>
              <ColContainer>
                <TextField
                  type="number"
                  label={t('components.interactModal.gas_limit')}
                  onChange={this.changeGasLimit}
                />
              </ColContainer>
            </RowContainer>
            <RowContainer>
              <AmountContainer>
                <TezosNumericInput
                  decimalSeparator={t('general.decimal_separator')}
                  labelText={t('general.nouns.amount')}
                  amount={amount}
                  handleAmountChange={this.changeAmount}
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
                  onChange={this.changeFee}
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
              onClick={this.onInvokeAddress}
            >
              {t('general.verbs.invoke')}
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
              onCloseClick={this.closeLedgerConfirmation}
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
      invokeAddress
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InteractContractModal);
