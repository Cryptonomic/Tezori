// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import Loader from '../Loader/';
import DeployContract from './DeployContract';
import InvokeContract from './InvokeContract';

import { createNewAccount } from '../../reduxContent/createDelegate/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import fetchAverageFees from '../../reduxContent/generalThunk';
import invokeAddress from '../../reduxContent/invokeAddress/thunks';
import { OPERATIONFEE } from '../../constants/LowFeeValue';
import {
  ModalWrapper,
  ModalContainer,
  ModalTitle,
  CloseIconWrapper,
  StyledTabs,
  StyledTab
} from './style';

type Props = {
  isLedger: boolean,
  isLoading: boolean,
  selectedParentHash: string,
  addresses: List,
  open: boolean,
  invokeAddress: () => {},
  createNewAccount: () => {},
  fetchAverageFees: () => {},
  setIsLoading: () => {},
  onCloseClick: () => {},
  t: () => {}
};

const defaultState = {
  activeTab: 0,
  averageFees: {
    low: 1420,
    medium: 2840,
    high: 5680
  }
};

class InteractContractModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const { open, fetchAverageFees } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchAverageFees('transaction');
      if (averageFees.low < OPERATIONFEE) {
        averageFees.low = OPERATIONFEE;
      }
      this.setState({
        averageFees
      }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  onSetTab = (event, activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab, averageFees } = this.state;
    const {
      isLoading,
      isLedger,
      open,
      addresses,
      selectedParentHash,
      onCloseClick,
      invokeAddress,
      createNewAccount,
      setIsLoading,
      t
    } = this.props;
    return (
      <ModalWrapper open={open}>
        {!!open && (
          <ModalContainer>
            <CloseIconWrapper onClick={onCloseClick} />
            <ModalTitle>{t('components.interactModal.title')}</ModalTitle>
            <StyledTabs
              value={activeTab}
              onChange={this.onSetTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <StyledTab
                label={t('components.interactModal.invoke_contract')}
              />
              <StyledTab
                label={t('components.interactModal.deploy_contract')}
              />
            </StyledTabs>

            <SwipeableViews index={activeTab}>
              <InvokeContract
                isLedger={isLedger}
                isLoading={isLoading}
                addresses={addresses}
                selectedParentHash={selectedParentHash}
                averageFees={averageFees}
                onClose={onCloseClick}
                setIsLoading={setIsLoading}
                invokeAddress={invokeAddress}
                t={t}
              />
              <DeployContract
                isLedger={isLedger}
                isLoading={isLoading}
                addresses={addresses}
                onClose={onCloseClick}
                setIsLoading={setIsLoading}
                createNewAccount={createNewAccount}
                t={t}
              />
            </SwipeableViews>

            {isLoading && <Loader />}
          </ModalContainer>
        )}
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
      createNewAccount
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InteractContractModal);
