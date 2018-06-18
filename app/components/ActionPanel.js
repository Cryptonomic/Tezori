// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BalanceBanner from './BalanceBanner';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';
import Loader from './Loader';
import tabConstants from '../constants/tabConstants';

import { selectAccount } from '../reducers/address.duck';

import styles from './ActionPanel.css';

const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

type Props = {
  selectedAccount: Object, // TODO: add type for this
  isLoadingTransactions: boolean,
  selectedAccountHash: string,
  selectedParentHash: string,
  selectAccount: Function
};

class ActionPanel extends Component<Props> {
  props: Props;

  state = {
    activeTab: TRANSACTIONS,
    currentPage: 1
  };

  onDataRefresh = () => {
    const {
      selectAccount,
      selectedAccountHash,
      selectedParentHash,
    } = this.props;

    selectAccount(selectedAccountHash, selectedParentHash);
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
    const { selectedAccountHash, selectedAccount } = this.props;

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
      default: {
        const transactions = selectedAccount.get('transactions');

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
    }
  };

  render() {
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    const {
      selectedAccount,
      selectedAccountHash,
    } = this.props;

    return (
      <div className={styles.actionPanelContainer}>
        <BalanceBanner
          balance={selectedAccount.get('balance') || 0}
          publicKeyHash={selectedAccountHash || 'Inactive'}
          onRefreshClick={this.onDataRefresh}
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
    isLoadingTransactions: address.get('isLoading'),
    selectedAccountHash: address.get('selectedAccountHash'),
    selectedParentHash: address.get('selectedParentHash'),
    selectedAccount: address.get('selectedAccount'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectAccount,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);
