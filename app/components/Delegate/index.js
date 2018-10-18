// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from './../Button/';
import TezosIcon from './../TezosIcon/';
import DelegateConfirmationModal from '../DelegateConfirmationModal';
import TezosAddress from '../TezosAddress';
import { wrapComponent } from '../../utils/i18n';

import {
  validateAddress,
  delegate,
  fetchDelegationAverageFees
} from '../../reduxContent/delegate/thunks';

type Props = {
  selectedAccountHash?: string,
  selectedParentHash?: string,
  address?: string,
  delegate?: () => {},
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
const WarningContainer = styled.div`
  height: 91px;
  width: 60%;
  border: solid 1px rgba(148, 169, 209, 0.49);
  border-radius: 3px;
  background-color: ${({ theme: { colors } }) => colors.light};
  display: flex;
  align-items: center;
  padding: 0 19px;
  margin-right: 5%;
`;
const InfoText = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  letter-spacing: 0.7px;
  margin-left: 11px;
  line-height: 21px;
`;

const initialState = {
  open: false,
  isLoading: false,
  tempAddress: '',
  password: '',
  fee: 100,
  isShowedPwd: false,
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  },
  isDelegateIssue: true
};

class Delegate extends Component<Props> {
  props: Props;
  state = initialState;

  async componentWillMount() {
    const { fetchDelegationAverageFees } = this.props;
    const averageFees = await fetchDelegationAverageFees();
    this.setState({ averageFees, fee: averageFees.low });
  }

  openConfirmation = () => this.setState({ open: true });
  closeConfirmation = () => {
    const { averageFees, fee } = this.state;
    this.setState({ ...initialState, averageFees, fee });
  };
  handlePasswordChange = (password) =>  this.setState({ password });
  handleTempAddressChange = (tempAddress) =>  this.setState({ tempAddress });
  handleFeeChange = (fee) =>  this.setState({ fee });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

  getAddress = () => {
    const { tempAddress } = this.state;
    const { address } = this.props;
    return tempAddress || address;
  };

  onDelegate = async () => {
    const { password, fee, tempAddress } = this.state;
    const { delegate, selectedAccountHash, selectedParentHash } = this.props;
    this.setIsLoading(true);
    if (
      await delegate(
        tempAddress,
        Math.floor(fee),
        password,
        selectedAccountHash,
        selectedParentHash
      )
    ) {
      this.closeConfirmation();
    } else {
      this.setIsLoading(false);
    }
  };

  onEnterPress = (event) => {
    if(this.state.tempAddress !== '' && this.state.password !== '' && event.key === 'Enter') {
      this.onDelegate();
    }
  }

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
    const { address, t } = this.props;
    const { isLoading, open, password, fee, averageFees, tempAddress, isShowedPwd, isDelegateIssue } = this.state;
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
          {address && (
            <DelegateInputContainer>
              <SetADelegate>{t('components.delegate.current_delegate')}:</SetADelegate>
              <TezosAddress
                address={address}
                size="16px"
                color="primary"
                color2="index0"
              />
              <UpdateButton
                disabled={isLoading}
                onClick={this.openConfirmation}
                buttonTheme="secondary"
                small
              >
                {t('components.delegate.change_delegate')}
              </UpdateButton>
            </DelegateInputContainer>
          )}
          {!address && (
            <WarningContainer>
              <TezosIcon iconName="info" size={ms(5)} color="info" />
              <InfoText>
                {t('components.delegate.delegate_warning')}
              </InfoText>
            </WarningContainer>
          )}
          <DelegationTipsContainer>
            <DelegationTitle>{t('components.addressBlock.delegation_tips')}</DelegationTitle>
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
          averageFees={averageFees}
          handleFeeChange={this.handleFeeChange}
          handlePasswordChange={this.handlePasswordChange}
          onAddressChange={this.handleTempAddressChange}
          onDelegate={this.onDelegate}
          onCloseClick={this.closeConfirmation}
          isLoading={isLoading}
          isShowedPwd={isShowedPwd}
          onShowPwd={()=> this.setState({isShowedPwd: !isShowedPwd})}
          isDelegateIssue={isDelegateIssue}
          onDelegateIssue={(status)=> this.setState({isDelegateIssue: status})}
        />
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDelegationAverageFees,
      validateAddress,
      delegate
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(null, mapDispatchToProps))(Delegate);
