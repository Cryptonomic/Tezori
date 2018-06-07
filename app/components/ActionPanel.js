// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BalanceBanner from './BalanceBanner';
import tabConstants from '../constants/tabConstants';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';
import Loader from './Loader';

import styles from './ActionPanel.css';

const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

type Props = {
  selectedAccount: Object, // TODO: add type for this
  isLoadingTransactions: boolean,
  selectedAccountHash: string
};

class ActionPanel extends Component<Props> {
  props: Props;

  state = {
    activeTab: TRANSACTIONS,
    currentPage: 1
  };

  renderTab = tab => {
    const { activeTab } = this.state;
    const tabClass = classNames({
      [styles.activeTab]: activeTab === tab,
      [styles.inactiveTab]: activeTab !== tab
    });

    return (
      <div
        className={tabClass}
        key={tab}
        onClick={() => this.setState({ activeTab: tab })}
      >
        {tab}
      </div>
    );
  };

  renderSection = () => {
    const transactions = [
      {
        amount: 20.52,
        address: 'aovk012-34rasfga'
      },
      {
        amount: 14.23,
        address: '2094tajfgijw9egj23r'
      },
      {
        amount: 61.2,
        address: 'vnzckijgwoie412039as'
      },
      {
        amount: 89.12,
        address: '12094rjasifgj203fj'
      }
    ];
    const { selectedAccountHash } = this.props;

    switch (this.state.activeTab) {
      case DELEGATE:
        return (
          <div className={styles.delegateContainer}>
            <Delegate />
          </div>
        );
      case RECEIVE:
        return (
          <div className={styles.receiveContainer}>
            <Receive address={selectedAccountHash} />
          </div>
        );
      case SEND:
        return (
          <div className={styles.sendContainer}>
            <Send />
          </div>
        );
      case TRANSACTIONS:
      default:
        return (
          <div className={styles.transactionsContainer}>
            <Transactions transactions={transactions} />
            <PageNumbers
              currentPage={this.state.currentPage}
              numberOfPages={4}
              onClick={currentPage => this.setState({ currentPage })}
            />
            {this.props.isLoadingTransactions && <Loader />}
          </div>
        );
    }
  };

  render() {
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    const { selectedAccount } = this.props;
    const publicKeyHash = selectedAccount.has('accountId') ? selectedAccount.get('accountId') : selectedAccount.get('publicKeyHash');

    return (
      <div className={styles.actionPanelContainer}>
        <BalanceBanner
          balance={selectedAccount.get('balance') || 0}
          publicKeyHash={publicKeyHash || ''}
        />
        <div className={styles.tabContainer}>{tabs.map(this.renderTab)}</div>
        {this.renderSection()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    selectedAccountHash: address.get('selectedAccountHash'),
    selectedAccount: address.get('selectedAccount'),
    isLoadingTransactions: address.get('isLoading'),
  };
}

export default connect(mapStateToProps, null)(ActionPanel);
