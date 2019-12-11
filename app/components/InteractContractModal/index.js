// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import Loader from '../Loader/';
import DeployContract from './DeployContract';
import InvokeContract from './InvokeContract';

import { invokeAddress } from '../../reduxContent/invoke/thunks';
import { originateContract } from '../../reduxContent/originate/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import fetchAverageFees from '../../reduxContent/generalThunk';
import { OPERATIONFEE } from '../../constants/LowFeeValue';
import {
  ModalWrapper,
  ModalContainer,
  ModalTitle,
  CloseIconWrapper
} from './style';
import themes from '../../styles/theme';

const styles = {
  tabsRoot: {},
  tabsIndicator: {
    height: 0
  },
  tabRoot: {
    textTransform: 'initial',
    opacity: 1,
    height: '60px',
    backgroundColor: themes.colors.accent,
    color: themes.colors.white,
    '&$tabSelected': {
      color: themes.colors.primary,
      backgroundColor: themes.colors.white
    }
  },
  tabLabel: {
    fontWeight: 500,
    fontSize: '16px'
  },
  tabSelected: {}
};

type Props = {
  isLedger: boolean,
  isLoading: boolean,
  selectedParentHash: string,
  addresses: List,
  open: boolean,
  classes: object,
  invokeAddress: () => {},
  originateContract: () => {},
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
  },
  enterCounts: [0, 0]
};

class InteractContractModal extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { ...defaultState };
  }

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

  onEnterPress = event => {
    if (event.key === 'Enter') {
      const { activeTab, enterCounts } = this.state;
      enterCounts[activeTab] += 1;
      this.setState({ enterCounts });
    }
  };

  render() {
    const { activeTab, averageFees, enterCounts } = this.state;
    const {
      classes,
      isLoading,
      isLedger,
      open,
      addresses,
      selectedParentHash,
      onCloseClick,
      invokeAddress,
      originateContract,
      setIsLoading,
      t
    } = this.props;

    return (
      <ModalWrapper open={open} onKeyDown={this.onEnterPress}>
        {open ? (
          <ModalContainer>
            <CloseIconWrapper onClick={onCloseClick} />
            <ModalTitle>{t('components.interactModal.title')}</ModalTitle>
            <Tabs
              classes={{
                root: classes.tabsRoot,
                indicator: classes.tabsIndicator
              }}
              value={activeTab}
              onChange={this.onSetTab}
              variant="fullWidth"
              fullWidth
            >
              <Tab
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected,
                  label: classes.tabLabel
                }}
                label={t('components.interactModal.invoke_contract')}
              />
              <Tab
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected,
                  label: classes.tabLabel
                }}
                label={t('components.interactModal.deploy_contract')}
              />
            </Tabs>

            <SwipeableViews index={activeTab}>
              <InvokeContract
                enterNum={enterCounts[0]}
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
                enterNum={enterCounts[1]}
                isLedger={isLedger}
                isLoading={isLoading}
                addresses={addresses}
                averageFees={averageFees}
                onClose={onCloseClick}
                setIsLoading={setIsLoading}
                originateContract={originateContract}
                t={t}
              />
            </SwipeableViews>
            {isLoading && <Loader />}
          </ModalContainer>
        ) : (
          <ModalContainer />
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
      originateContract
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InteractContractModal));
