// @flow
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { lighten } from 'polished';
import { isEmpty } from 'lodash'

import Button from './Button';
import BalanceBanner from './BalanceBanner';
import EmptyState from './EmptyState';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';
import Loader from './Loader';
import tabConstants from '../constants/tabConstants';
import { ms } from '../styles/helpers';
import transactionsEmptyState from '../../resources/transactionsEmptyState.svg'

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
  height: calc(100% - 150px);
  background-color: white;
  padding: ${ms(4)};
`;

const Link = styled.span`
  color: ${ ({ theme: { colors } }) => colors.blue };
  cursor: pointer;
`

const DescriptionContainer = styled.p`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
  text-align: center;
`

type DescriptionProps = {
  onSendClick: Function,
  onReceiveClick: Function
}

const Description = (props:DescriptionProps) => {
  const { onSendClick, onReceiveClick } = props
  return (
    <DescriptionContainer>
      It's pretty empty here. Get started
      <Link onClick={onSendClick}> sending</Link> and 
      <Link onClick={onReceiveClick}> receiving</Link> tez from this address.
    </DescriptionContainer>
  )
}

const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

type Props = {
  selectedAccount: Object, // TODO: add type for this
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

  handleLinkPress = tab => {
    this.setState({ activeTab: tab })
  }

  renderSection = () => {
    const { selectedAccountHash, selectedAccount } = this.props;

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
        const transactions = selectedAccount.get('transactions');

        return (
          <SectionContainer>
            {
              isEmpty(transactions.toJS())
              ? <EmptyState
                imageSrc={transactionsEmptyState}
                title={'You have not made any transactions yet'}
                description={
                  <Description
                    onReceiveClick={() => this.handleLinkPress(RECEIVE)}
                    onSendClick={() => this.handleLinkPress(SEND)}
                  />}
                />
              : <Fragment>
                <Transactions transactions={transactions} />
                <PageNumbers
                  currentPage={this.state.currentPage}
                  numberOfPages={4}
                  onClick={currentPage => this.setState({ currentPage })}
                />
                {this.props.isLoadingTransactions && <Loader />}
              </Fragment>
            }
          </SectionContainer>
        );
      }
    }
  };

  render() {
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    const { selectedAccount, selectedAccountHash } = this.props;

    const { activeTab } = this.state;

    return (
      <Container>
        <BalanceBanner
          balance={selectedAccount.get('balance') || 0}
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

        {this.renderSection()}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    isLoadingTransactions: address.get('isLoading'),
    selectedAccountHash: address.get('selectedAccountHash'),
    selectedParentHash: address.get('selectedParentHash'),
    selectedAccount: address.get('selectedAccount')
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
