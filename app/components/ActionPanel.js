// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { lighten } from 'polished';

import { getSelectedAccount } from '../utils/general';
import Button from './Button';
import BalanceBanner from './BalanceBanner';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';
import Loader from './Loader';
import tabConstants from '../constants/tabConstants';
import { ms } from '../styles/helpers';

import { selectAccount } from '../reducers/address.duck';

const Container = styled.section`
  flex-grow: 1;
`;

const Tab = styled(Button)`
  background: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.accent};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.primary : lighten(0.4, colors.accent)};
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  padding: ${ms(-1)} ${ms(1)};
  border-radius: 0;
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: ${ms(4)};
`;

const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

type Props = {
  identities: array,
  isLoadingTransactions: boolean,
  selectedAccountHash: string,
  selectedParentHash: string,
  selectAccount: Function
};

type State = {
  activeTab: string,
  currentPage: number
};

class ActionPanel extends Component<Props, State> {
  props: Props;

  state = {
    activeTab: TRANSACTIONS,
    currentPage: 1
  };

  handleDataRefresh = () => {
    const {
      selectAccount,
      selectedAccountHash,
      selectedParentHash
    } = this.props;

    selectAccount(selectedAccountHash, selectedParentHash);
  };

  renderSection = ( transactions ) => {
    const { selectedAccountHash } = this.props;
    switch (this.state.activeTab) {
      case DELEGATE:
        return (
          <SectionContainer>
            <Delegate />
          </SectionContainer>
        );
      case RECEIVE:
        return (
          <SectionContainer>
            <Receive address={selectedAccountHash} />
          </SectionContainer>
        );
      case SEND:
        return (
          <SectionContainer>
            <Send />
          </SectionContainer>
        );
      case TRANSACTIONS:
      default: {
        return (
          <SectionContainer>
            <Transactions transactions={transactions || []} />
            <PageNumbers
              currentPage={this.state.currentPage}
              numberOfPages={4}
              onClick={currentPage => this.setState({ currentPage })}
            />
            {this.props.isLoadingTransactions && <Loader />}
          </SectionContainer>
        );
      }
    }
  };

  render() {
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    const { identities, selectedAccountHash, selectedParentHash } = this.props;
    const selectedAccount = getSelectedAccount(identities.toJS(), selectedAccountHash, selectedParentHash);
    const transactions = selectedAccount.get('transactions');
    const balance = selectedAccount.get('balance');
    
    const { activeTab } = this.state;

    return (
      <Container>
        <BalanceBanner
          balance={balance || 0}
          publicKeyHash={selectedAccountHash || 'Inactive'}
          onRefreshClick={this.handleDataRefresh}
        />

        <TabList>
          {tabs.map(tab => (
            <Tab
              isActive={activeTab === tab}
              key={tab}
              buttonTheme="plain"
              onClick={() => this.setState({ activeTab: tab })}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        { this.renderSection(transactions) }
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    identities: address.get('identities'),
    isLoadingTransactions: address.get('isLoading'),
    selectedAccountHash: address.get('selectedAccountHash'),
    selectedParentHash: address.get('selectedParentHash'),
  };
}

function mapDispatchToProps(dispatch: Function) {
  return bindActionCreators(
    {
      selectAccount
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);
