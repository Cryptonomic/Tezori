// @flow
import React, { Component, Fragment } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from './../Button/';
import TezosIcon from './../TezosIcon/';
import DelegateConfirmationModal from '../DelegateConfirmationModal';
import TezosAddress from '../TezosAddress';
import { wrapComponent } from '../../utils/i18n';
import DelegateLedgerConfirmationModal from '../DelegateLedgerConfirmationModal';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { getIsReveal } from '../../reduxContent/wallet/thunks';
import { OPERATIONFEE, REVEALOPERATIONFEE } from '../../constants/LowFeeValue';

import {
  validateAddress,
  delegate,
  fetchDelegationAverageFees
} from '../../reduxContent/delegate/thunks';

type Props = {
  selectedAccountHash?: string,
  selectedParentHash?: string,
  address?: string | null,
  delegate?: () => {},
  fetchDelegationAverageFees: () => {},
  getIsReveal: () => {},
  isLedger: boolean,
  t: () => {}
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const DelegateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${ms(2)};
`;

const DelegateInputContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UpdateButton = styled(Button)`
  flex: 0 auto;
  margin: ${ms(2)} 0 0 0;
`;

const Title = styled.div`
  font-size: 24px;
  line-height: 34px;
  letter-spacing: 1px;
  font-weight: 300;
  width: 100%;
  color: ${({ theme: { colors } }) => colors.primary};
  border-bottom: 1px solid #e2e7f2;
  padding-bottom: ${ms(-4)};
`;

const DelegationTipsList = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${ms(1)};
  list-style-type: none;
`;

const DelegationTipsItem = styled.li`
  display: flex;
  font-weight: ${({ theme: { typo } }) => typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: ${ms(-2)} 0;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.gray3};
`;

const DelegationTipsIcon = styled(TezosIcon)`
  padding-top: ${ms(-10)};
  padding-right: ${ms(-2)};
`;

const DelegationTipsContainer = styled.div`
  width: 35%;
  padding: ${ms(2)};
  background-color: ${({ theme: { colors } }) => colors.gray2};
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: ${ms(-1)};
  position: relative;
`;

const DelegationTitle = styled.span`
  color: ${({ theme: { colors } }) => colors.gray3};
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  font-size: ${ms(1)};
`;

const SetADelegate = styled.div`
  font-weight: 300;
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 14px;
  color: ${({ theme: { colors } }) => colors.black2};
`;

const initialState = {
  open: false,
  isLoading: false,
  tempAddress: '',
  password: '',
  fee: 2840,
  miniFee: 0,
  isShowedPwd: false,
  isDisplayedFeeTooltip: false,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  },
  isDelegateIssue: true,
  isOpenLedgerConfirm: false
};

class Delegate extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    const {
      fetchDelegationAverageFees,
      getIsReveal,
      selectedAccountHash,
      selectedParentHash
    } = this.props;
    this.mounted = true;
    const averageFees = await fetchDelegationAverageFees();
    const isRevealed = await getIsReveal(
      selectedAccountHash,
      selectedParentHash
    );
    let miniLowFee = OPERATIONFEE;
    if (!isRevealed) {
      averageFees.low += REVEALOPERATIONFEE;
      averageFees.medium += REVEALOPERATIONFEE;
      averageFees.high += REVEALOPERATIONFEE;
      miniLowFee += REVEALOPERATIONFEE;
    }
    if (averageFees.low < miniLowFee) {
      averageFees.low = miniLowFee;
    }

    if (this.mounted) {
      this.setState({
        averageFees,
        fee: averageFees.medium,
        miniFee: miniLowFee,
        isDisplayedFeeTooltip: !isRevealed
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onOpenLedgerConfirmation = status =>
    this.setState({ isOpenLedgerConfirm: status });

  openConfirmation = () => this.setState({ open: true });
  closeConfirmation = () => {
    const { averageFees, fee } = this.state;
    this.setState({ ...initialState, averageFees, fee });
  };
  handlePasswordChange = password => this.setState({ password });
  handleTempAddressChange = tempAddress => this.setState({ tempAddress });
  handleFeeChange = fee => this.setState({ fee });
  setIsLoading = isLoading => this.setState({ isLoading });

  onDelegate = async () => {
    const { password, fee, tempAddress } = this.state;
    const {
      delegate,
      selectedAccountHash,
      selectedParentHash,
      isLedger
    } = this.props;
    this.setIsLoading(true);
    if (isLedger) {
      this.onOpenLedgerConfirmation(true);
    }
    const isDelegated = await delegate(
      tempAddress,
      Math.floor(fee),
      password,
      selectedAccountHash,
      selectedParentHash
    ).catch(err => {
      console.error(err);
      return false;
    });
    this.onOpenLedgerConfirmation(false);
    this.setIsLoading(false);
    if (isDelegated) {
      this.closeConfirmation();
    }
  };

  onEnterPress = event => {
    const { tempAddress, password } = this.state;
    if (event.key === 'Enter' && tempAddress !== '' && password !== '') {
      this.onDelegate();
    }
  };

  renderDelegationTips = arr => {
    return (
      <DelegationTipsList>
        {arr.map((item, index) => {
          return (
            <DelegationTipsItem key={index}>
              <DelegationTipsIcon
                iconName="arrow-right"
                size={ms(0)}
                color="gray3"
              />
              <div>{item}</div>
            </DelegationTipsItem>
          );
        })}
      </DelegationTipsList>
    );
  };

  render() {
    const { address, isLedger, selectedAccountHash, t } = this.props;
    const {
      isLoading,
      open,
      password,
      fee,
      miniFee,
      averageFees,
      tempAddress,
      isShowedPwd,
      isDelegateIssue,
      isOpenLedgerConfirm,
      isDisplayedFeeTooltip
    } = this.state;
    const delegationTips = [
      t('components.addressBlock.descriptions.description1'),
      t('components.addressBlock.descriptions.description2'),
      t('components.addressBlock.descriptions.description3'),
      t('components.addressBlock.descriptions.description4')
    ];

    return (
      <Container>
        <Title>{t('components.delegate.delegate_settings')}</Title>
        <DelegateContainer>
          <DelegateInputContainer>
            {!!address && (
              <Fragment>
                <SetADelegate>
                  {t('components.delegate.current_delegate')}:
                </SetADelegate>
                <TezosAddress
                  address={address}
                  size="16px"
                  color="primary"
                  color2="index0"
                />
              </Fragment>
            )}
            <UpdateButton
              disabled={isLoading}
              onClick={this.openConfirmation}
              buttonTheme="secondary"
              small
            >
              {t('components.delegate.change_delegate')}
            </UpdateButton>
          </DelegateInputContainer>
          <DelegationTipsContainer>
            <DelegationTitle>
              {t('components.addressBlock.delegation_tips')}
            </DelegationTitle>
            {this.renderDelegationTips(delegationTips)}
          </DelegationTipsContainer>
        </DelegateContainer>

        <DelegateConfirmationModal
          onEnterPress={this.onEnterPress}
          open={open}
          address={address}
          newAddress={tempAddress}
          password={password}
          fee={fee}
          miniFee={miniFee}
          averageFees={averageFees}
          handleFeeChange={this.handleFeeChange}
          handlePasswordChange={this.handlePasswordChange}
          onAddressChange={this.handleTempAddressChange}
          onDelegate={this.onDelegate}
          onCloseClick={this.closeConfirmation}
          isLoading={isLoading}
          isLedger={isLedger}
          isShowedPwd={isShowedPwd}
          isDisplayedFeeTooltip={isDisplayedFeeTooltip}
          onShowPwd={() => this.setState({ isShowedPwd: !isShowedPwd })}
          isDelegateIssue={isDelegateIssue}
          onDelegateIssue={status => this.setState({ isDelegateIssue: status })}
        />
        {isLedger && isOpenLedgerConfirm && (
          <DelegateLedgerConfirmationModal
            fee={fee}
            address={tempAddress}
            source={selectedAccountHash}
            open={isOpenLedgerConfirm}
            onCloseClick={() => this.onOpenLedgerConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </Container>
    );
  }
}

Delegate.defaultProps = {
  address: ''
};

function mapStateToProps(state) {
  return {
    isLedger: getIsLedger(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDelegationAverageFees,
      validateAddress,
      delegate,
      getIsReveal
    },
    dispatch
  );
}

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Delegate);
