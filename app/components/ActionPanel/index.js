// @flow
import React, { Component, Fragment } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { lighten } from 'polished';
import { isEmpty } from 'lodash';
import { Trans } from 'react-i18next';

import Button from '../Button/';
import BalanceBanner from '../BalanceBanner/';
import EmptyState from '../EmptyState/';
import PageNumbers from '../PageNumbers/';
import Transactions from '../Transactions/';
import Send from '../Send/';
import Receive from '../Receive/';
import Delegate from '../Delegate/';
import Loader from '../Loader/';
import AccountStatus from '../AccountStatus/';
import {
  TRANSACTIONS,
  SEND,
  RECEIVE,
  DELEGATE
} from '../../constants/TabConstants';
import { ms } from '../../styles/helpers';
import transactionsEmptyState from '../../../resources/transactionsEmptyState.svg';
import { READY } from '../../constants/StatusTypes';
import { sortArr } from '../../utils/array';
import { getSelectedAccount, isReady } from '../../utils/general';
import { findIdentity, findIdentityIndex } from '../../utils/identity';

import { syncWallet, updateActiveTab } from '../../reduxContent/wallet/thunks';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.section`
  flex-grow: 1;
`;

const Tab = styled(Button)`
  background: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.accent};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.primary : lighten(0.4, colors.accent)};
  cursor: ${({ isReady }) => (isReady ? 'pointer' : 'initial')};
  text-align: center;
  font-weight: 500;
  padding: ${ms(-1)} ${ms(1)};
  border-radius: 0;
`;

const TabList = styled.div`
  background-color: ${({ theme: { colors } }) => colors.accent};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 50px;
`;

const TabText = styled.span`
  opacity: ${({ isReady }) => (isReady ? '1' : '0.5')};
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: ${ms(4)};
  min-height: 600px;
`;

const Link = styled.span`
  color: ${({ theme: { colors } }) => colors.blue1};
  cursor: pointer;
`;

const DescriptionContainer = styled.p`
  color: ${({ theme: { colors } }) => colors.gray5};
  text-align: center;
`;

type DescriptionProps = {
  onSendClick: () => {},
  onReceiveClick: () => {}
};

const Description = (props: DescriptionProps) => {
  const { onSendClick, onReceiveClick } = props;
  return (
    <DescriptionContainer>
      <Trans i18nKey="components.actionPanel.description">
        {"It's pretty empty here. Get started"}
        <Link onClick={onSendClick}> sending</Link> and
        <Link onClick={onReceiveClick}> receiving</Link> tez from this address.
      </Trans>
    </DescriptionContainer>
  );
};

type Props = {
  updateActiveTab: () => {},
  identities: array,
  isLoadingTransactions: boolean,
  syncWallet: () => {},
  selectedAccountHash: string,
  selectedParentHash: string,
  time?: Date,
  t: () => {}
};

type State = {
  currentPage: number
};

class ActionPanel extends Component<Props, State> {
  props: Props;

  state = {
    currentPage: 1
  };

  handleLinkPress = activeTab => {
    const {
      selectedAccountHash,
      selectedParentHash,
      updateActiveTab
    } = this.props;
    updateActiveTab(selectedAccountHash, selectedParentHash, activeTab);
  };

  renderSection = (selectedAccount, activeTab, balance) => {
    const { selectedAccountHash, selectedParentHash, t } = this.props;
    const transactions = selectedAccount.get('transactions');
    const ready = selectedAccount.get('status') === READY;

    switch (activeTab) {
      case DELEGATE:
        return (
          <Delegate
            isReady={ready}
            address={selectedAccount.get('delegateValue')}
            selectedAccountHash={selectedAccountHash}
            selectedParentHash={selectedParentHash}
          />
        );
      case RECEIVE:
        return <Receive address={selectedAccountHash} />;
      case SEND:
        return (
          <Send
            isReady={ready}
            selectedAccountHash={selectedAccountHash}
            selectedParentHash={selectedParentHash}
            addressBalance={balance}
            isManager={selectedAccountHash === selectedParentHash}
          />
        );
      case TRANSACTIONS:
      default: {
        if (!ready) {
          return (
            <AccountStatus
              address={selectedAccount}
              isManager={selectedAccountHash === selectedParentHash}
            />
          );
        }
        
        const JSTransactions = transactions
          .sort(sortArr({ sortOrder: 'desc', sortBy: 'timestamp' }))
          .toJS();
        const itemsCount = 5;
        const pageCount = Math.ceil(JSTransactions.length / itemsCount);

        const firstNumber = (this.state.currentPage - 1) * itemsCount;
        const lastNumber = this.state.currentPage * itemsCount;
        const showedTransactions = JSTransactions.slice(
          firstNumber,
          lastNumber
        );

        return isEmpty(JSTransactions) ? (
          <EmptyState
            imageSrc={transactionsEmptyState}
            title={t('components.actionPanel.empty-title')}
            description={
              <Description
                onReceiveClick={() => this.handleLinkPress(RECEIVE)}
                onSendClick={() => this.handleLinkPress(SEND)}
              />
            }
          />
        ) : (
          <Fragment>
            <Transactions
              transactions={showedTransactions}
              selectedAccountHash={selectedAccountHash}
              selectedParentHash={selectedParentHash}
            />
            {pageCount > 1 && (
              <PageNumbers
                currentPage={this.state.currentPage}
                numberOfPages={pageCount}
                onClick={currentPage => this.setState({ currentPage })}
              />
            )}
            {this.props.isLoadingTransactions && <Loader />}
          </Fragment>
        );
      }
    }
  };

  render() {
    const {
      identities,
      selectedAccountHash,
      selectedParentHash,
      syncWallet,
      time
    } = this.props;
    const jsIdentities = identities.toJS();
    const selectedAccount = getSelectedAccount(
      jsIdentities,
      selectedAccountHash,
      selectedParentHash
    );
    const parentIdentity = findIdentity(jsIdentities, selectedParentHash);
    const parentIndex = findIdentityIndex(jsIdentities, selectedParentHash) + 1;
    const isManagerAddress = selectedAccountHash === selectedParentHash;
    const balance = selectedAccount.get('balance');
    const activeTab = selectedAccount.get('activeTab') || TRANSACTIONS;

    const storeType = selectedAccount.get('storeType');
    const status = selectedAccount.get('status');

    const tabs = isManagerAddress
      ? [TRANSACTIONS, SEND, RECEIVE]
      : [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    return (
      <Container>
        <BalanceBanner
          storeType={storeType}
          isReady={isReady(status, storeType)}
          balance={balance || 0}
          publicKeyHash={selectedAccountHash || 'Inactive'}
          parentIdentity={parentIdentity}
          parentIndex={parentIndex}
          isManagerAddress={isManagerAddress}
          onRefreshClick={syncWallet}
          selectedParentHash={selectedParentHash}
          time={time}
          delegatedAddress={selectedAccount.get('delegateValue')}
        />

        <TabList>
          {tabs.map(tab => {
            const ready = isReady(status, storeType, tab);
            return (
              <Tab
                isActive={activeTab === tab}
                key={tab}
                isReady={ready}
                buttonTheme="plain"
                onClick={() => {
                  if (ready) {
                    this.handleLinkPress(tab);
                  }
                }}
              >
                <TabText isReady={ready}>{tab}</TabText>
              </Tab>
            );
          })}
        </TabList>
        <SectionContainer>
          {this.renderSection(selectedAccount, activeTab, balance || 0)}
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
function mapDispatchToProps(dispatch: () => {}) {
  return bindActionCreators(
    {
      updateActiveTab,
      syncWallet
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(mapStateToProps, mapDispatchToProps))(ActionPanel);
