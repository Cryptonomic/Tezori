// @flow
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { lighten } from 'polished';
import { isEmpty } from 'lodash'

import { getSelectedAccount } from '../utils/general';
import { findIdentity, findIdentityIndex } from '../utils/identity';
import Button from './Button';
import BalanceBanner from './BalanceBanner';
import EmptyState from './EmptyState';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate/';
import Loader from './Loader';
import { TRANSACTIONS, SEND, RECEIVE, DELEGATE } from '../constants/TabConstants';
import { ms } from '../styles/helpers';
import transactionsEmptyState from '../../resources/transactionsEmptyState.svg'
import { READY } from '../constants/StatusTypes';

import { syncWallet, updateActiveTab } from '../reduxContent/wallet/thunks';

const Container = styled.section`
  flex-grow: 1;
`;

const Tab = styled(Button)`
  background: ${({ isActive, isReady, theme: { colors } }) => {
  const color = isActive
    ? colors.white
    : colors.accent;

  const inActiveColors = isActive
    ? colors.white
    : colors.disabled;

  return isReady
    ? color
    : inActiveColors
  }};
  color: ${({ isActive, theme: { colors } }) =>
  isActive ? colors.primary : lighten(0.4, colors.accent) };
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  padding: ${ms(-1)} ${ms(1)};
  border-radius: 0;
`;

const TabList = styled.div`
  background-color: ${({ isReady, theme: { colors } }) => isReady ? colors.accent: colors.disabled };
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 50px;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 150px);
  background-color: white;
  padding: ${ms(4)};
`;

const Link = styled.span`
  color: ${ ({ theme: { colors } }) => colors.blue1 };
  cursor: pointer;
`

const DescriptionContainer = styled.p`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
  text-align: center;
`

type DescriptionProps = {
  onSendClick: Function,
  onReceiveClick: Function
};

const Description = (props: DescriptionProps) => {
  const { onSendClick, onReceiveClick } = props
  return (
    <DescriptionContainer>
      {"It's pretty empty here. Get started"}
      <Link onClick={onSendClick}> sending</Link> and
      <Link onClick={onReceiveClick}> receiving</Link> tez from this address.
    </DescriptionContainer>
  )
}

type Props = {
  updateActiveTab: Function,
  identities: array,
  isLoadingTransactions: boolean,
  syncWallet: Function
};

type State = {
  activeTab: string,
  currentPage: number
};

const delegateAddressTabs = [TRANSACTIONS, SEND, RECEIVE];
const managerAddresssTabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];

class ActionPanel extends Component<Props, State> {
  props: Props;

  state = {
    currentPage: 1
  };

  handleLinkPress = activeTab => {
    const { selectedAccountHash, selectedParentHash, updateActiveTab } = this.props;
    updateActiveTab( selectedAccountHash, selectedParentHash, activeTab );
  };

  renderSection = () => {
    const { identities, selectedAccountHash, selectedParentHash } = this.props;
    const selectedAccount = getSelectedAccount(identities.toJS(), selectedAccountHash, selectedParentHash);
    const transactions = selectedAccount.get('transactions');
    const isReady = selectedAccount.get('status') === READY;
    
    switch (selectedAccount.get('activeTab')) {
      case DELEGATE:
        return (
          <Delegate
            isReady={isReady}
            address={selectedAccount.get('delegateValue')}
            selectedAccountHash={selectedAccountHash}
            selectedParentHash={selectedParentHash}
          />
        )
      case RECEIVE:
        return <Receive address={selectedAccountHash} />;
      case SEND:
        return(
          <Send
            isReady={isReady}
            selectedAccountHash={selectedAccountHash}
            selectedParentHash={selectedParentHash}
          />
        )
      case TRANSACTIONS:
      default: {
        const JSTransactions = transactions.toJS();
        return isEmpty(JSTransactions)
          ?
          (
            <EmptyState
              imageSrc={transactionsEmptyState}
              title='You have not made any transactions yet'
              description={
                <Description
                  onReceiveClick={() => this.handleLinkPress(RECEIVE)}
                  onSendClick={() => this.handleLinkPress(SEND)}
                />
            }
            />
          )
          :
          (
            <Fragment>
              <Transactions
                transactions={JSTransactions}
                selectedAccountHash={selectedAccountHash}
                selectedParentHash={selectedParentHash}
              />
              <PageNumbers
                currentPage={this.state.currentPage}
                numberOfPages={4}
                onClick={currentPage => this.setState({ currentPage })}
              />
              {this.props.isLoadingTransactions && <Loader />}
            </Fragment>
          )
          ;
      }
    }
  };

  render() {
    const { identities, selectedAccountHash, selectedParentHash, syncWallet, time } = this.props;
    const jsIdentities = identities.toJS();
    const selectedAccount = getSelectedAccount(jsIdentities, selectedAccountHash, selectedParentHash);
    const parentIdentity = findIdentity(jsIdentities, selectedParentHash);
    const parentIndex =  findIdentityIndex(jsIdentities, selectedParentHash) + 1;
    const isManagerAddress = selectedAccountHash === selectedParentHash;
    const balance = selectedAccount.get('balance');
    const activeTab = selectedAccount.get('activeTab');

    const isReady = selectedAccount.get('status') === READY;

    const tabs = isManagerAddress ? [TRANSACTIONS, SEND, RECEIVE] : [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    return (
      <Container>
        <BalanceBanner
          isReady={isReady}
          balance={balance || 0}
          publicKeyHash={selectedAccountHash || 'Inactive'}
          parentIdentity={parentIdentity}
          parentIndex={parentIndex}
          isManagerAddress={isManagerAddress}
          onRefreshClick={syncWallet}
          time={time}
        />

        <TabList isReady={isReady}>
          {tabs.map(tab => (
            <Tab
              isActive={activeTab === tab}
              key={tab}
              isReady={isReady}
              buttonTheme="plain"
              onClick={() => this.handleLinkPress(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        <SectionContainer>
          { this.renderSection() }
        </SectionContainer>

      </Container>
    );
  }
}

function mapStateToProps({ wallet }) {
  return {
    identities: wallet.get('identities'),
    isLoadingTransactions: wallet.get('isLoading'),
    time: wallet.get('time')
  };
}
function mapDispatchToProps(dispatch: Function) {
  return bindActionCreators(
    {
      updateActiveTab,
      syncWallet
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);
