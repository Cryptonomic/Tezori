// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../styles/helpers';
import Button from './Button';
import { utezToTez } from '../utils/currancy';
import { H4 } from './Heading';
import TezosIcon from './TezosIcon';

import Loader from './Loader';
import tezosLogo from '../../resources/tezosLogo.png';
import {
  updatePassword,
  updateAddress,
  showConfirmationModal,
  closeConfirmationModal,
  sendConfirmation,
} from '../reducers/delegate.duck';

import styles from './Delegate.css';

type Props = {};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const DelegateContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DelegateInputContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: ${ms(1)};
`;

const UpdateButton = styled(Button)`
  flex: 0 auto;
  margin: ${ms(2)} 0 0 0;
`;

const Title = styled(H4)`
  width: 100%;
  border-bottom: 1px solid #e2e7f2;
  padding-bottom: ${ms(-4)}
`;

const DelegationTipsList = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${ms(1)};
  list-style-type: none;
`

const DelegationTipsItem = styled.li`
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: ${ms(-2)} 0;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.gray3};
`

const DelegationTipsIcon = styled(TezosIcon)`
  padding-top: ${ms(-10)};
  padding-right: ${ms(-2)};
`

const DelegationTipsContainer = styled.div`
  width: 35%;
  padding: ${ms(2)};
  background-color: ${({ theme: { colors } }) => colors.gray2};
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: ${ms(-1)};
  position: relative;
  margin-top: ${ms(1)};
`

const DelegationTitle = styled.span`
  color: ${({ theme: { colors } }) => colors.gray3};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  font-size: ${ms(1)};
`

const SetADelegate = styled.p`
  font-weight: 300;
  font-size: ${ms(1)};
  margin-bottom: 0;
`;

class Delegate extends Component<Props> {
  props: Props;

  onModalClose = () => {
    this.props.updatePassword('');
    this.props.closeConfirmationModal();
  };

  renderWarningModal = () => {
    const {
      address,
      delegateFee,
      password,
      updatePassword,
      sendConfirmation,
      isConfirmationModalOpen,
      isLoading
    } = this.props;

    return (
      <Dialog
        modal
        open={isConfirmationModalOpen}
        title="Confirm Delegate Change"
        contentStyle={{ width: '600px' }}
      >
        <div>
          <CloseIcon
            className={styles.closeIcon}
            style={{ fill: '#7190C6' }}
            onClick={this.onModalClose}
          />
          <div>Are you sure you want to change your delegate to:</div>
          <div className={styles.modalAddress}>{address}</div>
          <div className={styles.feeContainer}>
            <div className={styles.feeText}>Fee: </div>
            {utezToTez(delegateFee)}
            <img src={tezosLogo} className={styles.tezosSymbol} />
          </div>
          <div className={styles.confirmationContainer}>
            <TextField
              floatingLabelText="Enter Password"
              style={{ width: '50%' }}
              type="password"
              value={password}
              onChange={(_, newPassword) => updatePassword(newPassword)}
            />

            <Button
              buttonTheme="primary"
              disabled={isLoading}
              small
              onClick={sendConfirmation}
            >
              Confirm
            </Button>
          </div>
          {isLoading && <Loader />}
        </div>
      </Dialog>
    );
  };


  renderDelegationTips = (arr) => {
    return(
      <DelegationTipsList>
        {arr.map((item, index) => {
          return(
            <DelegationTipsItem key={index}>
              <DelegationTipsIcon
                iconName="arrow-right"
                size={ms(0)}
                color="gray3"
              />
              <div>{item}</div>
            </DelegationTipsItem>
          )
        })}
      </DelegationTipsList>
    )
  }

  render() {
    const { isReady, address, showConfirmationModal, updateAddress, theme } = this.props;
    const delegationTips = [
      'Delegating tez is not the same as sending tez. Only baking rights are transferred when setting a delegate. The delegate that you set cannot spend your tez.',
      'There is a fee for setting a delegate.',
      'Delegating is not instant. It takes 7 cycles (2-3 weeks) for your tez to start contributing to baking.',
      'Delegation rewards will depend on your arrangement with the delegate.'
    ]

    return (
      <Container>
        <Title>Delegate Settings</Title>
        <DelegateContainer>
          <DelegateInputContainer>
            <SetADelegate>Set a Delegate</SetADelegate>
            <TextField
              floatingLabelText="Address"
              value={address}
              style={{minWidth: 340, width: 'auto'}}
              onChange={(_, newAddress) => updateAddress(newAddress)}
            />

            <UpdateButton
              disabled={!isReady}
              onClick={showConfirmationModal}
              buttonTheme="secondary"
              small
            >
              Update
            </UpdateButton>
          </DelegateInputContainer>
          <DelegationTipsContainer>
            <DelegationTitle>Delegation Tips</DelegationTitle>
            {this.renderDelegationTips(delegationTips)}
          </DelegationTipsContainer>
        </DelegateContainer>

        {this.renderWarningModal()}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { delegate } = state;

  return {
    isConfirmationModalOpen: delegate.get('isConfirmationModalOpen'),
    isLoading: delegate.get('isLoading'),
    password: delegate.get('password'),
    address: delegate.get('address'),
    delegateFee: delegate.get('delegateFee')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updatePassword,
      updateAddress,
      showConfirmationModal,
      closeConfirmationModal,
      sendConfirmation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Delegate);
