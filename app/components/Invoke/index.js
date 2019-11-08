// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '../Button/';
import { wrapComponent } from '../../utils/i18n';
import TezosNumericInput from '../TezosNumericInput';
import TextField from '../TextField';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import InvokeLedgerConfirmationModal from '../InvokeLedgerConfirmationModal';
import FormatSelector from '../FormatSelector';

import fetchAverageFees from '../../reduxContent/generalThunk';
import { invokeAddress } from '../../reduxContent/invoke/thunks';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { setIsLoading } from '../../reduxContent/wallet/actions';

import { OPERATIONFEE } from '../../constants/LowFeeValue';

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
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  height: 64px;
  width: 100%;
`;

export const ColStorage = styled.div`
  flex: 1;
`;

export const ColFormat = styled.div`
  min-width: 19%;
  margin-left: 80px;
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

const utez = 1000000;

type Props = {
  isReady?: boolean,
  isLedger: boolean,
  isLoading: boolean,
  addresses: List,
  selectedParentHash: string,
  selectedAccountHash: string,
  onSuccess: () => {},
  fetchAverageFees: () => {},
  invokeAddress: () => {},
  setIsLoading: () => {},
  t: () => {}
};

const initialState = {
  fee: 1420,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  },
  selectedInvokeAddress: '',
  gas: 0,
  storage: 0,
  amount: '0',
  parameters: '',
  passPhrase: '',
  isShowedPwd: false,
  isOpenLedgerConfirm: false,
  codeFormat: 'micheline',
  entryPoint: ''
};

class Invoke extends Component<Props> {
  props: Props;
  state = initialState;
  state = {
    ...initialState,
    selectedInvokeAddress: this.props.addresses[0].pkh,
    balance: this.props.addresses[0].balance
  };

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
        fee: averageFees.low
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
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

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.onInvokeOperation();
    }
  };

  onInvokeOperation = async () => {
    const {
      isLedger,
      selectedParentHash,
      selectedAccountHash,
      invokeAddress,
      setIsLoading,
      onSuccess
    } = this.props;

    const {
      amount,
      fee,
      storage,
      gas,
      parameters,
      selectedInvokeAddress,
      passPhrase,
      codeFormat,
      entryPoint
    } = this.state;

    setIsLoading(true);

    if (isLedger) {
      this.onLedgerConfirmation(true);
    }

    const operationResult = await invokeAddress(
      selectedAccountHash,
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
    this.onLedgerConfirmation(false);
    setIsLoading(false);

    if (operationResult) {
      onSuccess();
    }
  };

  render() {
    const {
      amount,
      selectedInvokeAddress,
      fee,
      isOpenLedgerConfirm,
      parameters,
      averageFees,
      passPhrase,
      isShowedPwd,
      storage,
      codeFormat
    } = this.state;

    const { isReady, isLoading, isLedger, selectedAccountHash, t } = this.props;
    const isDisabled =
      !isReady || isLoading || !amount || (!passPhrase && !isLedger);

    return (
      <Container onKeyDown={event => this.onEnterPress(event.key, isDisabled)}>
        <ParametersContainer>
          <ColStorage>
            <TextField
              label={t('components.interactModal.parameters')}
              onChange={val => this.setState({ parameters: val })}
            />
          </ColStorage>
          <ColFormat>
            <FormatSelector
              value={codeFormat}
              onChange={val => this.setState({ codeFormat: val })}
            />
          </ColFormat>
        </ParametersContainer>
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
            address={selectedAccountHash}
            source={selectedInvokeAddress}
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
      invokeAddress,
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
)(Invoke);
