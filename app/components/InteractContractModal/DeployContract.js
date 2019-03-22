// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from '../TextField';
import TezosNumericInput from '../TezosNumericInput/';
import { ms } from '../../styles/helpers';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import TezosAmount from '../TezosAmount';
import TezosAddress from '../TezosAddress';
import DeployLedgerConfirmationModal from '../DeployLedgerConfirmationModal';

import { createNewAccount } from '../../reduxContent/createDelegate/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import fetchAverageFees from '../../reduxContent/generalThunk';
import invokeAddress from '../../reduxContent/invokeAddress/thunks';
import { OPERATIONFEE } from '../../constants/LowFeeValue';

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
  UseMax
} from './style';

const utez = 1000000;

type Props = {
  isLoading: boolean,
  isLedger: boolean,
  averageFees: object,
  addresses: List,
  createNewAccount: () => {},
  onClose: () => {},
  t: () => {}
};

const defaultState = {
  gas: 0,
  storage: 0,
  fee: 1420,
  amount: '',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  michelsonCode: ''
};

class DeployContract extends Component<Props> {
  props: Props;
  state = {
    ...defaultState,
    fee: this.props.averageFees.low
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

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && isDisabled) {
      this.onDeployOperation();
    }
  };

  onDeployOperation = async () => {
    const {
      createNewAccount,
      setIsLoading,
      isLedger,
      addresses,
      onClose
    } = this.props;

    const {
      passPhrase,
      amount,
      gas,
      storage,
      fee,
      michelsonCode,
      parameters
    } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    const { pkh } = addresses[0];
    const initStorage = parameters ? JSON.parse(parameters) : {};
    const initCode = michelsonCode ? JSON.parse(michelsonCode) : [];
    const bakerAddress = 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5';

    const isOperationCompleted = await createNewAccount(
      bakerAddress,
      amount,
      fee,
      passPhrase,
      pkh,
      storage,
      gas,
      initCode,
      initStorage
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
      isOpenLedgerConfirm
    } = this.state;

    const { isLoading, isLedger, addresses, averageFees, t } = this.props;

    const isDisabled = isLoading || !amount || (!passPhrase && !isLedger);

    return (
      <MainContainer
        onKeyDown={event => this.onEnterPress(event.key, isDisabled)}
      >
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
              onChange={val => this.setState({ parameters: val })}
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
            open={isOpenLedgerConfirm}
            onCloseClick={() => this.closeLedgerConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </MainContainer>
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
      createNewAccount
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeployContract);
